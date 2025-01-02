// Imports from WordPress libraries
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, TextControl, RangeControl } from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";

// Represent the final simplified event data structure we'll use in the editor UI
interface Event {
  id: string;
  title: string;
  datum?: string;
  startRFC?: string; // We'll store start RFC so we can map to calendar
  startTime?: string; // Extracted from START_UHRZEIT for display
}

// The raw API response structure per item (after fetching from the endpoint)
interface ApiVeranstaltung {
  Veranstaltung: {
    ID: string;
    _event_TITLE: string;
    DATUM?: string;
    START_RFC?: string;
    START_UHRZEIT?: string;
    // Other fields are available, but we only use what we need.
  };
}

interface Attributes {
  id: string; // 'vid' is a string
  limit: number;
}

export default function Edit({
  attributes,
  setAttributes,
}: {
  attributes: Attributes;
  setAttributes: (newAttributes: Partial<Attributes>) => void;
}) {
  const props = useBlockProps();
  const { id, limit } = attributes;
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    const queryParams = `vid=${id}${limit ? `&itemsPerPage=${limit}` : ""}`;

    apiFetch({
      path: `evangelische-termine-ausgeben/v1/data?endpoint=events&${queryParams}`,
    })
      .then((data: ApiVeranstaltung[]) => {
        const transformedEvents: Event[] = data.map((item) => ({
          id: item.Veranstaltung.ID,
          title: item.Veranstaltung._event_TITLE,
          datum: item.Veranstaltung.DATUM,
          startRFC: item.Veranstaltung.START_RFC,
          startTime: item.Veranstaltung.START_UHRZEIT
            ? item.Veranstaltung.START_UHRZEIT.replace(".", ":")
            : undefined,
        }));
        setEvents(transformedEvents);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setError(
          __(
            "Fehler beim Abrufen der Veranstaltungen.",
            "evangelische-termine-ausgeben"
          )
        );
        setLoading(false);
      });
  }, [id, limit]);

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Einstellungen", "evangelische-termine-ausgeben")}>
          <TextControl
            label={__("Veranstalter ID", "evangelische-termine-ausgeben")}
            value={id}
            onChange={(value) => setAttributes({ id: value })}
            help={__(
              "Geben Sie die Veranstalter-ID ein.",
              "evangelische-termine-ausgeben"
            )}
          />
          <RangeControl
            label={__(
              "Anzahl der Veranstaltungen",
              "evangelische-termine-ausgeben"
            )}
            value={limit}
            onChange={(value) => setAttributes({ limit: value })}
            min={1}
            max={50}
          />
        </PanelBody>
      </InspectorControls>
      <div {...props}>
        <h2>{__("Events", "evangelische-termine-ausgeben")}</h2>
        {loading && (
          <p>
            {__("Lade Veranstaltungen...", "evangelische-termine-ausgeben")}
          </p>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <dl>
          {events.map((event) => (
            <>
              <dt key={event.id}>
                <strong>{event.title}</strong>
              </dt>
			  <dd>{event.datum && <br />}{event.datum && <span>{event.datum}</span>}</dd>
              <dd key={`${event.id}-dd`}>{event.startTime && <span>{event.startTime}</span>}</dd>
            </>
          ))}
        </dl>
      </div>
    </>
  );
}
