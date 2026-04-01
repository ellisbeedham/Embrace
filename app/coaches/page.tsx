import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Coaches | Embrace Boxing",
  description: "Meet the expert coaches at Embrace Boxing. World-class training from experienced professionals.",
};

const coaches = [
  {
    name: "Ruqsana Begum",
    role: "Founder & Head Coach",
    bio: "Muay Thai and Boxing World Champion. Author of Born Fighter. Ruqsana leads Embrace Boxing with a mission to empower women through the sport she loves. From IFMA gold to WKA World Title, her journey inspires women at all levels.",
    image: null,
  },
  {
    name: "Coach Placeholder",
    role: "Boxing Coach",
    bio: "Add coach bio and details here. This is a placeholder for additional staff members. Update with real content when available.",
    image: null,
  },
];

export default function CoachesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">Our Coaches</h1>
      <p className="text-xl text-embrace-muted mb-12">
        Meet the team behind Embrace Boxing
      </p>

      <div className="space-y-12">
        {coaches.map((coach, index) => (
          <div
            key={coach.name}
            className={`flex flex-col ${
              index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
            } gap-8 items-center`}
          >
            <div className="flex-shrink-0 w-48 h-48 rounded-full bg-embrace-muted/20 flex items-center justify-center text-embrace-muted">
              {coach.image ? (
                <img
                  src={coach.image}
                  alt={coach.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold">
                  {coach.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{coach.name}</h2>
              <p className="text-embrace-gold font-medium mb-4">{coach.role}</p>
              <p className="text-embrace-muted leading-relaxed">{coach.bio}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-12 text-sm text-embrace-muted">
        Add more coaches to the coaches array in the code. Include name, role,
        bio, and optional image URL for each team member.
      </p>
    </div>
  );
}
