import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Embrace Boxing",
  description:
    "Train like a champion with a champion. Learn about Embrace Boxing, Ruqsana Begum, and our mission to empower women through boxing.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">
        Train Like a Champion With a Champion
      </h1>
      <p className="text-embrace-gold font-medium mb-12">
        Delivering Authentic Boxing Training
      </p>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Our Values</h2>
        <h3 className="text-xl font-semibold mb-4">
          Empowering Women Through Boxing
        </h3>
        <div className="space-y-4 text-embrace-muted leading-relaxed">
          <p>
            At Embrace Boxing, we passionately believe in the transformative
            power of boxing for both mental and physical well-being. In a
            male-dominated space, we are dedicated to creating a safe and
            empowering environment specifically for women. We strive to shatter
            stereotypes and make boxing more inclusive by providing a welcoming
            space where women can embrace the sport and feel empowered by it.
          </p>
          <p>
            Our mission goes beyond just teaching boxing skills; it&apos;s about
            fostering confidence, resilience, and a sense of belonging. Through
            our classes and personal training programs, we aim to build a strong
            foundation of discipline and dedication while nurturing a passion
            for boxing that transcends the ring. We&apos;re committed to
            equipping women with the tools they need to succeed not only in
            boxing but in all aspects of their lives. Join us at Embrace Boxing,
            where we empower women to unleash their full potential and embrace
            the champion within.
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Meet Ruqsana</h2>
        <h3 className="text-xl font-semibold mb-4">The Founder</h3>
        <div className="space-y-4 text-embrace-muted leading-relaxed">
          <p>
            Ruqsana Begum, celebrated worldwide for her achievements in Muay
            Thai and professional boxing, boasts a remarkable career that
            transcends sports. From securing gold at the esteemed IFMA
            championships to attaining the WKA World Title in Muay Thai.
          </p>
          <p>
            Ruqsana has also had the honor of being a torchbearer for the
            London Olympics 2012 and was presented to Queen Elizabeth II for
            breaking down cultural barriers by being the first British muslim.
            Ruqsana was also awarded Sports Personality of the Year which
            further underscores her impact on the sporting world.
          </p>
          <p>
            Transitioning to professional boxing Ruqsana was signed to David
            Haye, the former world champion, making her debut on Channel 5. As
            an acclaimed author of &quot;Born Fighter,&quot; she shares her
            extraordinary journey, earning accolades like the Sports Book
            Awards&apos; Autobiography of the Year. Her influence extends
            beyond literature; through her captivating YouTube series and
            motivational speaking engagements, she inspires people from all
            walks of life to overcome obstacles and pursue their dreams.
          </p>
          <p>
            With a steadfast dedication to supporting women in boxing, she
            continues to pave the way for inclusivity and excellence in the
            sport. Ruqsana is now focusing her efforts on supporting women
            participating in boxing, further solidifying her commitment to
            empowering women in sports.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Fitness Meets Faith</h2>
        <h3 className="text-xl font-semibold mb-4">Embrace History</h3>
        <div className="space-y-4 text-embrace-muted leading-relaxed">
          <p>
            Ruqsana&apos;s journey began in a traditional, male-dominated
            boxing gym. Feeling isolated and intimidated by the lack of female
            representation and coaching, she recognized the need for a more
            inclusive space. Determined to empower women through boxing and
            contribute positively to her community, Ruqsana embarked on a
            mission to create a welcoming environment where all women, regardless
            of background or faith, could find empowerment and self-expression
            through sport.
          </p>
          <p>
            Understanding the specific needs of Muslim women, who often require
            female tutors due to religious beliefs, Ruqsana initially aimed to
            provide a safe haven for them. However, she quickly realized that
            the need for such a space extended beyond religious considerations.
            Thus, Embrace Faith Meets Fitness was born—a place where women from
            all walks of life can come together to embrace the transformative
            power of boxing and foster a sense of community.
          </p>
        </div>
      </section>
    </div>
  );
}
