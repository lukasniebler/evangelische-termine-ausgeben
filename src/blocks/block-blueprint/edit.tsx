// Imports from WordPress libraries
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import {
  PanelBody,
  TextControl,
  RangeControl,
  SelectControl,
} from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";

interface Event {
  id: string;
  title: string;
  datum?: string;
  startRFC?: string;
  startTime?: string;
}

interface SelectOption {
  label: string;
  value: string;
}

interface NamedItem {
  id: number | string;
  name: string;
}

interface ApiVeranstaltung {
  Veranstaltung: {
    ID: string;
    _event_TITLE: string;
    DATUM?: string;
    START_RFC?: string;
    START_UHRZEIT?: string;
    LITURG_BEZ?: string;
    WOCHENTAG_START_LANG?: string;
    WOCHENTAG_START_KURZ?: string;

  };
}

interface Attributes {
  id: string;
  limit: number;
  eventType?: string;
  people?: string;
  placeType?: string;
}

export default function Edit({
  attributes,
  setAttributes,
}: {
  attributes: Attributes;
  setAttributes: (newAttributes: Partial<Attributes>) => void;
}) {
  const props = useBlockProps();
  const {
    id,
    limit,
    eventType = "",
    people = "",
    placeType = "",
  } = attributes;
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const eventTypeLabel = __(
    "Alle Veranstaltungstypen",
    "evangelische-termine-ausgeben"
  );
  const peopleLabel = __(
    "Alle Zielgruppen",
    "evangelische-termine-ausgeben"
  );
  const placeTypeLabel = __(
    "Alle Orte",
    "evangelische-termine-ausgeben"
  );
  const [eventTypeOptions, setEventTypeOptions] = useState<SelectOption[]>([
    { label: eventTypeLabel, value: "" },
  ]);
  const [peopleOptions, setPeopleOptions] = useState<SelectOption[]>([
    { label: peopleLabel, value: "" },
  ]);
  const [placeTypeOptions, setPlaceTypeOptions] = useState<SelectOption[]>([
    { label: placeTypeLabel, value: "" },
  ]);

  useEffect(() => {
    let isMounted = true;
    const fetchNamedItems = (endpoint: string) =>
      apiFetch<NamedItem[]>({
        path: `evangelische-termine-ausgeben/v1/data?endpoint=${endpoint}`,
      });

    const buildOptions = (items: NamedItem[], emptyLabel: string) => [
      { label: emptyLabel, value: "" },
      ...items.map((item) => ({ label: item.name, value: String(item.id) })),
    ];

    const optionRequests = [
      {
        endpoint: "eventtypes",
        setter: setEventTypeOptions,
        label: eventTypeLabel,
      },
      { endpoint: "people", setter: setPeopleOptions, label: peopleLabel },
      {
        endpoint: "placetype",
        setter: setPlaceTypeOptions,
        label: placeTypeLabel,
      },
    ];

    const loadOptions = async () => {
      const results = await Promise.allSettled(
        optionRequests.map((option) => fetchNamedItems(option.endpoint))
      );

      if (!isMounted) {
        return;
      }

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          const option = optionRequests[index];
          option.setter(buildOptions(result.value, option.label));
        } else {
          console.error(
            `Error fetching ${optionRequests[index].endpoint}:`,
            result.reason
          );
        }
      });
    };

    loadOptions();

    return () => {
      isMounted = false;
    };
  }, [eventTypeLabel, peopleLabel, placeTypeLabel]);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    const params = new URLSearchParams();
    params.append("vid", id);
    if (limit) {
      params.append("itemsPerPage", String(limit));
    }
    if (eventType) {
      params.append("eventtype", eventType);
    }
    if (people) {
      params.append("people", people);
    }
    if (placeType) {
      params.append("placetype", placeType);
    }

    const queryParams = params.toString();

    apiFetch({
      path: `evangelische-termine-ausgeben/v1/data?endpoint=events&${queryParams}`,
    })
      .then((data: ApiVeranstaltung[]) => {
        console.log(data);
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
  }, [id, limit, eventType, people, placeType]);

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
          <SelectControl
            label={__("Veranstaltungstyp", "evangelische-termine-ausgeben")}
            value={eventType}
            options={eventTypeOptions}
            onChange={(value: string) => setAttributes({ eventType: value })}
          />
          <SelectControl
            label={__("Zielgruppe", "evangelische-termine-ausgeben")}
            value={people}
            options={peopleOptions}
            onChange={(value: string) => setAttributes({ people: value })}
          />
          <SelectControl
            label={__("Ortskategorie", "evangelische-termine-ausgeben")}
            value={placeType}
            options={placeTypeOptions}
            onChange={(value: string) => setAttributes({ placeType: value })}
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
