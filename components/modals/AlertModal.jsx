import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '../ui/button';

const AlertModal = ({ isOpne, onClose, onConfirm, loading }) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <Modal
            title="Are you Sure?"
            description="This Action Can not be Undone!."
            isOpen={isOpne}
            onClose={onClose}
        >
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={loading} variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={loading} variant="destructive" onClick={onConfirm}>
                    Continue
                </Button>
            </div>

        </Modal>
    );
};

export default AlertModal;