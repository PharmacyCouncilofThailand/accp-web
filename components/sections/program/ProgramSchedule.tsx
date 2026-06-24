"use client";

import { useTranslations } from "next-intl";
import { programDays } from "@/data/programData";

interface Event {
  time: string;
  titleKey: string;
  type: string;
  icon: string;
}

interface GroupedEvent {
  time: string;
  events: Event[];
}

interface EventStyle {
  bg: string;
  light: string;
  labelKey: string;
}

const eventStyles: Record<string, EventStyle> = {
  plenary: { bg: "#1a237e", light: "#e8eaf6", labelKey: "eventTypePlenary" },
  symposia: { bg: "#3949ab", light: "#e3e8fd", labelKey: "eventTypeSymposia" },
  oral: { bg: "#1565c0", light: "#e3f2fd", labelKey: "eventTypeOral" },
  poster: { bg: "#f57c00", light: "#fff3e0", labelKey: "eventTypePoster" },
  ceremony: { bg: "#6a1b9a", light: "#f3e5f5", labelKey: "eventTypeCeremony" },
  social: { bg: "#c62828", light: "#ffebee", labelKey: "eventTypeSocial" },
  workshop: { bg: "#00695c", light: "#e0f2f1", labelKey: "eventTypeWorkshop" },
  registration: { bg: "#5c6bc0", light: "#e8eaf6", labelKey: "eventTypeRegistration" },
  break: { bg: "#78909c", light: "#eceff1", labelKey: "eventTypeBreak" },
};

const defaultEventStyle: EventStyle = {
  bg: "#78909c",
  light: "#eceff1",
  labelKey: "eventTypeBreak",
};

function getEventStyle(type: string): EventStyle {
  return eventStyles[type] ?? defaultEventStyle;
}

function EventContent({ text }: { text: string }) {
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  const [headline, ...details] = lines;

  return (
    <div className="program-schedule__event-content">
      <p className="program-schedule__event-headline">{headline}</p>
      {details.length > 0 && (
        <div className="program-schedule__event-details">
          {details.map((line, index) => (
            <p
              key={`${line}-${index}`}
              className={
                line.startsWith("-")
                  ? "program-schedule__event-bullet"
                  : "program-schedule__event-detail"
              }
            >
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProgramSchedule() {
  const t = useTranslations("program");

  const handleDownload = (dayIndex: number) => {
    const pdfFiles = [
      "/assets/documents/agenda-day1.pdf",
      "/assets/documents/agenda_day2.pdf",
      "/assets/documents/agenda_day3.pdf",
      "/assets/documents/agenda_all_day.pdf",
    ];
    const downloadNames = [
      "ACCP2026_Agenda_Day1.pdf",
      "ACCP2026_Agenda_Day2.pdf",
      "ACCP2026_Agenda_Day3.pdf",
      "ACCP2026_Agenda_All_Day.pdf",
    ];

    const pdfUrl = pdfFiles[dayIndex] || pdfFiles[0];
    const downloadName = downloadNames[dayIndex] || downloadNames[0];

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const groupEventsByTime = (events: Event[]): GroupedEvent[] => {
    const grouped: Record<string, Event[]> = {};
    events.forEach((event) => {
      if (!grouped[event.time]) grouped[event.time] = [];
      grouped[event.time].push(event);
    });
    return Object.entries(grouped).map(([time, groupedEvents]) => ({
      time,
      events: groupedEvents,
    }));
  };

  return (
    <section className="program-schedule service1-section-area sp1" aria-labelledby="program-schedule-title">
      <div className="program-schedule__ambient" aria-hidden="true" />

      <div className="container">
        <div className="row">
          <div className="col-lg-7 m-auto">
            <div className="heading2 text-center space-margin60">
              <h5 data-aos="fade-up" data-aos-duration={800}>
                {t("scientificProgram")}
              </h5>
              <div className="space16" />
              <h2 id="program-schedule-title" className="text-anime-style-3">
                {t("programAtAGlance")}
              </h2>
              <div className="space16" />
              <p className="program-schedule__intro" data-aos="fade-up" data-aos-duration={1000}>
                {t("programDesc")}
              </p>
            </div>
          </div>
        </div>

        <div className="program-schedule__legend" data-aos="fade-up" data-aos-duration={700}>
          {Object.entries(eventStyles).map(([type, style]) => (
            <span key={type} className="program-schedule__legend-item">
              <span
                className="program-schedule__legend-dot"
                style={{ backgroundColor: style.bg }}
                aria-hidden="true"
              />
              {t(style.labelKey)}
            </span>
          ))}
        </div>

        <div className="row" data-aos="fade-up" data-aos-duration={800}>
          <div className="col-12">
            <div className="program-schedule__actions">
              <button
                type="button"
                className="program-schedule__download-all"
                onClick={() => handleDownload(3)}
              >
                <i className="fa-solid fa-download" aria-hidden="true" />
                <span>{t("downloadPdf")}</span>
              </button>
              <button
                type="button"
                className="program-schedule__download-eprogram"
                disabled
                aria-disabled="true"
                title={t("comingSoon")}
              >
                <i className="fa-solid fa-book-open" aria-hidden="true" />
                <span>{t("downloadEProgramBook")}</span>
                <span className="program-schedule__coming-soon">{t("comingSoon")}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="program-schedule__days">
          {programDays.map((day, dayIndex) => {
            const groupedEvents = groupEventsByTime(day.events);

            return (
              <article
                key={day.dayKey}
                className="program-schedule__day"
                data-aos="fade-up"
                data-aos-duration={800}
                data-aos-delay={dayIndex * 100}
              >
                <header className="program-schedule__day-header">
                  <div className="program-schedule__day-meta">
                    <span className="program-schedule__day-badge">{t(day.dayKey)}</span>
                    <div className="program-schedule__day-info">
                      <div className="program-schedule__day-date">{day.date}</div>
                      <div className="program-schedule__day-venue">{t(`venueDay${dayIndex + 1}`)}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="program-schedule__day-download"
                    onClick={() => handleDownload(dayIndex)}
                    aria-label={t("downloadPdf")}
                  >
                    <i className="fa-solid fa-download" aria-hidden="true" />
                    <span>{t("downloadPdf")}</span>
                  </button>
                </header>

                <div className="program-schedule__timeline">
                  {groupedEvents.map((group, groupIndex) => {
                    const isParallel = group.events.length > 1;
                    const firstEventStyle = getEventStyle(group.events[0].type);

                    return (
                      <div
                        key={`${group.time}-${groupIndex}`}
                        className={`program-schedule__slot ${isParallel ? "is-parallel" : ""}`}
                      >
                        <div className="program-schedule__time">
                          <span
                            className="program-schedule__time-marker"
                            style={{ backgroundColor: firstEventStyle.bg }}
                            aria-hidden="true"
                          />
                          <div className="program-schedule__time-content">
                            <i
                              className={`fa-solid ${group.events[0].icon}`}
                              style={{ color: firstEventStyle.bg }}
                              aria-hidden="true"
                            />
                            <time className="program-schedule__time-text">{group.time}</time>
                            {isParallel && (
                              <span className="program-schedule__parallel-tag">
                                {t("parallelSessions")}
                              </span>
                            )}
                          </div>
                        </div>

                        <div
                          className={`program-schedule__events ${isParallel ? "is-grid" : ""}`}
                        >
                          {group.events.map((event, eventIndex) => {
                            const style = getEventStyle(event.type);
                            const title = t(event.titleKey);

                            return (
                              <div
                                key={`${event.titleKey}-${eventIndex}`}
                                className="program-schedule__event-card"
                                style={{
                                  backgroundColor: style.light,
                                  borderColor: `${style.bg}22`,
                                }}
                              >
                                <div className="program-schedule__event-top">
                                  <span
                                    className="program-schedule__type-badge"
                                    style={{
                                      color: style.bg,
                                      backgroundColor: `${style.bg}14`,
                                    }}
                                  >
                                    <i className={`fa-solid ${event.icon}`} aria-hidden="true" />
                                    {t(style.labelKey)}
                                  </span>
                                </div>
                                <EventContent text={title} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="program-schedule__footnote">{t("scheduleFootnote")}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
