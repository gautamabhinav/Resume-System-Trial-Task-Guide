import { useSelector } from "react-redux";

export default function ResumePreview() {
  const { resume, loading } = useSelector((state) => state.resume);

  if (loading) return <p>Loading resume...</p>;
  if (!resume) return <p>No resume data available.</p>;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-auto">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-indigo-700 mb-2">{resume.name || "Your Name"}</h2>
        <p className="text-sm text-gray-500 mb-2">{resume.email || "youremail@example.com"} • {resume.phone || "+91 XXXXX XXXXX"}</p>
      </div>

      {/* Summary */}
      {resume.summary && (
        <section className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Summary</h3>
          {/* If summary is structured { bullets: [], tldr: '' } render bullets */}
          {typeof resume.summary === 'object' && resume.summary !== null ? (
            <div className="text-gray-700">
              {Array.isArray(resume.summary.bullets) && (
                <ul className="list-disc ml-5 mb-2">
                  {resume.summary.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
              {resume.summary.tldr && <p className="text-sm text-gray-600">TL;DR: {resume.summary.tldr}</p>}
            </div>
          ) : (
            <p className="text-gray-700">{resume.summary}</p>
          )}
        </section>
      )}

      {/* Skills */}
      {resume.skills?.length > 0 && (
        <section className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, i) => (
              <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">{skill}</span>
            ))}
          </div>
        </section>
      )}

      {/* Optional sections (render strings or objects) */}
      {["projects", "internships", "courses", "hackathons"].map((section) => {
        // Support both plural and singular keys (some data may use singular names)
        const singular = section.replace(/s$/, "");
        const items = Array.isArray(resume[section])
          ? resume[section]
          : Array.isArray(resume[singular])
          ? resume[singular]
          : [];

        return (
          items.length > 0 && (
            <section key={section} className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-1 capitalize">{section}</h3>
              <ul className="list-disc ml-5 text-gray-700">
                {items.map((item, idx) => {
                  if (!item && item !== 0) return null;

                  if (typeof item === 'string') return <li key={idx}>{item}</li>;

                  // If item is an object, try to render useful fields
                  const title = item.title || item.name || item.role || item.position;
                  const desc = item.description || item.details || item.summary;
                  const company = item.company || item.institution;

                  const parts = [title, company, desc].filter(Boolean);
                  // If item includes a link, show it as a small anchor
                  const link = item.link || item.url;

                  // Fallback: if object has no displayable fields, stringify safely
                  const display = parts.length > 0 ? parts.join(' — ') : JSON.stringify(item);
                  return (
                    <li key={idx} className="mb-1">
                      <div>{display}</div>
                      {link && (
                        <a href={link} target="_blank" rel="noreferrer" className="text-sm text-indigo-600">
                          {link}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )
        );
      })}
    </div>
  );
}
