import { Helmet } from 'react-helmet-async';

import DecryptFileView from 'src/sections/user/view/decrypt-file-view';
// ----------------------------------------------------------------------

export default function DecryptFilePage() {
    return (
        <>
            <Helmet>
                <title> Tangly | Decrypt Files </title>
            </Helmet>

            <DecryptFileView />
        </>
    );
}
