// Imports from WordPress libraries
import {useBlockProps, InspectorControls, BlockControls} from "@wordpress/block-editor";
import {
  PanelBody,
  TextControl,
  RangeControl,
  SelectControl,
  ToolbarGroup,
  ToolbarButton,
} from "@wordpress/components";
import { Fragment, useEffect, useMemo, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";
import { calendar } from "@wordpress/icons";

interface Event {
  id: string;
  title: string;
  datum?: string;
  startRFC?: string;
  startTime?: string;
  endTime?: string;
  placeCategory?: string;
  shortDescription?: string;
  longDescription?: string;
  location?: string;
  detailsUrl?: string;
  weekdayLong?: string;
  weekdayShort?: string;
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
    END_UHRZEIT?: string;
    LITURG_BEZ?: string;
    WOCHENTAG_START_LANG?: string;
    WOCHENTAG_START_KURZ?: string;
    _place_KAT?: string;
    _event_SHORT_DESCRIPTION?: string;
    _event_LONG_DESCRIPTION?: string;
    _place_NAME?: string;
    _place_STREET_NR?: string;
    _place_ZIP?: string;
    _place_CITY?: string;

  };
}

const buildLocation = (
  veranstaltung: ApiVeranstaltung["Veranstaltung"]
): string | undefined => {
  const parts: string[] = [];
  if (veranstaltung._place_NAME) {
    parts.push(veranstaltung._place_NAME);
  }

  const addressSegments: string[] = [];
  if (veranstaltung._place_STREET_NR) {
    addressSegments.push(veranstaltung._place_STREET_NR);
  }

  const citySegment = [
    veranstaltung._place_ZIP,
    veranstaltung._place_CITY,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();
  if (citySegment) {
    addressSegments.push(citySegment);
  }

  if (addressSegments.length) {
    parts.push(addressSegments.join(", "));
  }

  if (!parts.length) {
    return undefined;
  }

  return parts.join(", ");
};

const stripTimeFromDatum = (datum?: string) => {
  if (!datum) {
    return undefined;
  }
  const pattern =
    /\s+\d{1,2}(?:[.:]\d{1,2})?(?:\s*-\s*\d{1,2}(?:[.:]\d{1,2})?)?\s*uhr/gi;
  const clean = datum.replace(pattern, "").trim();
  return clean || datum;
};

const normalizeTime = (time?: string) =>
  time ? time.replace(".", ":") : undefined;

const buildTimeText = (start?: string, end?: string) => {
  if (start && end) {
    return `${start} - ${end}`;
  }
  return start || end || undefined;
};

const WEEKDAY_SHORT_MAP: Record<string, string> = {
  montag: "Mo",
  dienstag: "Di",
  mittwoch: "Mi",
  donnerstag: "Do",
  freitag: "Fr",
  samstag: "Sa",
  sonntag: "So",
};

const determineShortWeekdayLabel = (
  weekdayLong?: string,
  weekdayShort?: string
) => {
  if (weekdayShort && weekdayShort.trim()) {
    return weekdayShort.trim();
  }
  if (weekdayLong && weekdayLong.trim()) {
    const key = weekdayLong.trim().toLocaleLowerCase("de-DE");
    return WEEKDAY_SHORT_MAP[key];
  }
  return undefined;
};

const extractLeadingWeekday = (dateText: string) => {
  const match = dateText.trimStart().match(/^([\p{L}äöüÄÖÜß]+)/u);
  return match ? match[1] : undefined;
};

const shortenWeekdayInText = (dateText: string, event: Event) => {
  const primaryShort = determineShortWeekdayLabel(
    event.weekdayLong,
    event.weekdayShort
  );

  const fallbackShort = !primaryShort
    ? determineShortWeekdayLabel(extractLeadingWeekday(dateText))
    : undefined;

  const replacement = primaryShort || fallbackShort;
  if (!replacement) {
    return dateText;
  }

  const seen = new Set<string>();
  const candidates = [
    event.weekdayLong,
    event.weekdayShort,
    extractLeadingWeekday(dateText),
  ].filter((value): value is string => Boolean(value && value.trim()));

  for (const candidate of candidates) {
    const normalized = candidate.trim();
    const normalizedLower = normalized.toLocaleLowerCase("de-DE");
    if (seen.has(normalizedLower)) {
      continue;
    }
    seen.add(normalizedLower);
    if (
      normalizedLower === replacement.toLocaleLowerCase("de-DE") ||
      !dateText.toLocaleLowerCase("de-DE").startsWith(normalizedLower)
    ) {
      continue;
    }
    return replacement + dateText.slice(normalized.length);
  }

  return dateText;
};

const formatDisplayDate = (event: Event, useShortWeekdays: boolean) => {
  const cleaned = stripTimeFromDatum(event.datum);
  if (!cleaned) {
    return undefined;
  }

  if (!useShortWeekdays) {
    return cleaned;
  }

  return shortenWeekdayInText(cleaned, event);
};

interface Attributes {
  id: string;
  limit: number;
  eventType?: string;
  people?: string;
  placeType?: string;
  searchText?: string;
  heading?: string;
  legacy?: boolean;
  shortWeekdays?: boolean;
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
    searchText = "",
    heading = "Veranstaltungen",
    shortWeekdays = false,
  } = attributes;
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const eventTypeLabel = __(
    "Alle Veranstaltungstypen",
    "evangelische-termine-ausgeben"
  );

  const Legacy = (
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="evenodd"><path d="m320-40-64-48 84-112H240q0-35 19.5-120.5T313-495q34-90 80.5-157.5T494-720q37 0 51.5 23t41.5 69q32 54 58 81t56 41q11-8 19-11t19-3q25 0 43 18t18 42v420h-40v-420q0-8-6-14t-14-6q-8 0-14 6t-6 14v50h-40v-19q-38-21-78-54.5T543-557l-23 117 80 239v161h-80v-160h-80L320-40Zm220-700q-33 0-56.5-23.5T460-820q0-8 4-24-11-5-17.5-14.5T440-880q0-17 11.5-28.5T480-920q12 0 21.5 6.5T516-896q6-2 12-3t12-1q33 0 56.5 23.5T620-820q0 33-23.5 56.5T540-740Z"/></svg>
  );
  const Modern = (
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="evenodd"><path d="M360-80v-529q-91-24-145.5-100.5T160-880h80q0 83 53.5 141.5T430-680h100q30 0 56 11t47 32l181 181-56 56-158-158v478h-80v-240h-80v240h-80Zm120-640q-33 0-56.5-23.5T400-800q0-33 23.5-56.5T480-880q33 0 56.5 23.5T560-800q0 33-23.5 56.5T480-720Z"/></svg>
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
  const selectedPlaceLabel = useMemo(() => {
    if (!placeType) {
      return null;
    }
    const selectedOption = placeTypeOptions.find(
      (option) => option.value === placeType && option.value !== ""
    );
    return selectedOption?.label ?? null;
  }, [placeTypeOptions, placeType]);

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
    if (placeType && !selectedPlaceLabel) {
      return;
    }

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
        const transformedEvents: Event[] = data.map((item) => ({
          id: item.Veranstaltung.ID,
          title: item.Veranstaltung._event_TITLE,
          datum: item.Veranstaltung.DATUM,
          startRFC: item.Veranstaltung.START_RFC,
          startTime: normalizeTime(item.Veranstaltung.START_UHRZEIT),
          endTime: normalizeTime(item.Veranstaltung.END_UHRZEIT),
          placeCategory: item.Veranstaltung._place_KAT,
          shortDescription: item.Veranstaltung._event_SHORT_DESCRIPTION,
          longDescription: item.Veranstaltung._event_LONG_DESCRIPTION,
          location: buildLocation(item.Veranstaltung),
          detailsUrl: item.Veranstaltung.ID
            ? `https://www.evangelische-termine.de/veranstaltung_im_detail${item.Veranstaltung.ID}.html?PHPSESSID=&popup=1&css=none`
            : undefined,
          weekdayLong: item.Veranstaltung.WOCHENTAG_START_LANG,
          weekdayShort: item.Veranstaltung.WOCHENTAG_START_KURZ,
        }));
        let filteredEvents = transformedEvents;
        if (placeType && selectedPlaceLabel) {
          filteredEvents = filteredEvents.filter(
            (event) => event.placeCategory === selectedPlaceLabel
          );
        }
        const normalizedSearch = searchText.trim().toLowerCase();
        if (normalizedSearch) {
          filteredEvents = filteredEvents.filter((event) => {
            const haystack = [
              event.title,
              event.shortDescription,
              event.longDescription,
            ]
              .filter(Boolean)
              .map((part) => part!.toLowerCase());
            return haystack.some((part) => part.includes(normalizedSearch));
          });
        }
        setEvents(filteredEvents);
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
  }, [
    id,
    limit,
    eventType,
    people,
    placeType,
    selectedPlaceLabel,
    searchText,
  ]);

  return (
    <>
      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton
              icon={attributes.legacy ? Legacy : Modern}
              label={
                attributes.legacy
                    ? __('Legacy mode active', 'evangelische-termine-ausgeben')
                    : __('Legacy mode inactive', 'evangelische-termine-ausgeben')
              }
              onClick={() => setAttributes({ legacy: !attributes.legacy })}
          />
          <ToolbarButton
            icon={calendar}
            isPressed={shortWeekdays}
            label={__(
              "Kurzform der Wochentage umschalten",
              "evangelische-termine-ausgeben"
            )}
            onClick={() =>
              setAttributes({ shortWeekdays: !shortWeekdays })
            }
          />
        </ToolbarGroup>
      </BlockControls>

      <InspectorControls>
        <PanelBody title={__("Einstellungen", "evangelische-termine-ausgeben")}>
          <TextControl
            label={__("Überschrift", "evangelische-termine-ausgeben")}
            value={heading}
            onChange={(value) => setAttributes({ heading: value })}
            help={__(
              "Leer lassen, um keine Überschrift anzuzeigen.",
              "evangelische-termine-ausgeben"
            )}
          />
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
          <TextControl
              label={__(
                  "Veranstaltungstyp",
                  "evangelische-termine-ausgeben"
              )}
              value={eventType}
              onChange={(value) => setAttributes({ eventType: value })}
              help={__(
                  "Ermöglicht die Nutzung von negativen Filterwerten (NICHT), Komma-separierten Filtern (ODER) und Punkt-separierten Filtern (UND).",
                  "evangelische-termine-ausgeben"
              )}
          />
          <SelectControl
            label={__("Zielgruppe", "evangelische-termine-ausgeben")}
            value={people}
            options={peopleOptions}
            onChange={(value: string) => setAttributes({ people: value })}
          />
          <TextControl
              label={__(
                  "Zielgruppe",
                  "evangelische-termine-ausgeben"
              )}
              value={people}
              onChange={(value) => setAttributes({ people: value })}
              help={__(
                  "Ermöglicht die Nutzung von negativen Filterwerten (NICHT), Komma-separierten Filtern (ODER) und Punkt-separierten Filtern (UND).",
                  "evangelische-termine-ausgeben"
              )}
          />
          <SelectControl
            label={__("Ortskategorie", "evangelische-termine-ausgeben")}
            value={placeType}
            options={placeTypeOptions}
            onChange={(value: string) => setAttributes({ placeType: value })}
          />
          <TextControl
              label={__(
                  "Ortskategorie",
                  "evangelische-termine-ausgeben"
              )}
              value={placeType}
              onChange={(value) => setAttributes({ placeType: value })}
              help={__(
                  "Ermöglicht die Nutzung von negativen Filterwerten (NICHT), Komma-separierten Filtern (ODER) und Punkt-separierten Filtern (UND).",
                  "evangelische-termine-ausgeben"
              )}
          />
          <TextControl
            label={__(
              "Nur Veranstaltungen mit folgendem Text",
              "evangelische-termine-ausgeben"
            )}
            value={searchText}
            onChange={(value) => setAttributes({ searchText: value })}
            help={__(
              "Filtert nach Titel oder Beschreibung.",
              "evangelische-termine-ausgeben"
            )}
          />
        </PanelBody>
      </InspectorControls>
      <div {...props}>
        {heading && <h2>{heading}</h2>}
        {loading && (
          <p>
            {__("Lade Veranstaltungen...", "evangelische-termine-ausgeben")}
          </p>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <dl>
          {events.map((event) => {
            const displayDate = formatDisplayDate(event, shortWeekdays);
            const timeText = buildTimeText(event.startTime, event.endTime);
            return (
              <Fragment key={event.id}>
                <dt>
                  {event.title && (
                    <strong>
                      {event.detailsUrl ? (
                        <a
                          href={event.detailsUrl}
                          rel="noopener noreferrer"
                        >
                          {event.title}
                        </a>
                      ) : (
                        event.title
                      )}
                    </strong>
                  )}
                </dt>
                {displayDate && (
                  <dd className="ln-eta-date">
                    <span className="ln-eta-date-text">{displayDate}</span>
                  </dd>
                )}
                {timeText && (
                  <dd className="ln-eta-time">
                    <span className="ln-eta-time-text">{timeText}</span>
                  </dd>
                )}
                {event.location && (
                  <dd className="ln-eta-location">
                    <span className="ln-eta-location-text">{event.location}</span>
                  </dd>
                )}
              </Fragment>
            );
          })}
        </dl>
      </div>
    </>
  );
}
