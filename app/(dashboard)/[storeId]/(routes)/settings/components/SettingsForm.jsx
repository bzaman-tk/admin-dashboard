'use client'

import Heading from "@/components/ui/Heading";



const SettingsForm = ({ initialData }) => {


    return (
        <div className="flex items-center justify-between">
            <Heading title="Store Settings" description="Manage Store Preferences" />
        </div>
    );
};

export default SettingsForm;