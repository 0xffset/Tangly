import { BlogView } from 'src/sections/blog/view';
import { Helmet } from 'react-helmet-async';

// ----------------------------------------------------------------------

export default function BlogPage() {
  return (
    <>
      <Helmet>
        <title> Blog | Minimal UI </title>
      </Helmet>

      <BlogView />
    </>
  );
}
