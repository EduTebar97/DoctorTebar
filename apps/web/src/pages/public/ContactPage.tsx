import { ContactForm } from "../../components/public/ContactForm";

export function ContactPage() {
  return (
    <section className="section contact-layout">
      <div><h1>Contacto y asesoria metodologica</h1><p>Describe el proyecto, la fase actual y el tipo de objetivo. La informacion sirve para orientar la primera revision metodologica.</p></div>
      <ContactForm />
    </section>
  );
}
