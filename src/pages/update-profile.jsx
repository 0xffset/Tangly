import { Helmet } from 'react-helmet-async';

import UpdateProfileView from 'src/sections/settings/update-profile-view';

// ----------------------------------------------------------------------

export default function UpdateProfilePage() {
    return (
        <>
            <Helmet>
                <title> Tangly | Update profile </title>
            </Helmet>

            <UpdateProfileView />
        </>
    );
}
