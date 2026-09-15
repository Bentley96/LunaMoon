// Renders HTML authored in wp-admin.
//
// The markup comes from WordPress's own editor (trusted, authenticated authors)
// and is sanitised server-side by wp_kses_post() before it reaches the REST
// response, so it is safe to inject here. Never point this at visitor-supplied
// content.
export default function RichText({
  html,
  className = '',
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={`prose-lunamoon ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
