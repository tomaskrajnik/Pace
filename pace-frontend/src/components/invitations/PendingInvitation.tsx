import { SpeakerphoneIcon } from '@heroicons/react/solid';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Invitation } from '../../models/invitations.model';
import InvitationService from '../../services/InvitationService';
import NormalButton from '../common/NormalButton';
import NormalText from '../common/NormalText';

interface PendingInvitationProps {
    invitation: Invitation;
}

export const PendingInvitation: React.FC<PendingInvitationProps> = ({ invitation }) => {
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState<'accept' | 'decline'>('accept');
    const respondToInvitation = async (responsetype: 'accept' | 'decline') => {
        try {
            setLoading(true);
            if (responsetype === 'accept') {
                toast.success('Invitation accepted');
                return await InvitationService.accept(invitation.uid);
            }
            await InvitationService.decline(invitation.uid);
            toast.success('Invitation declined');
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-100 border-2 mt-4 rounded-xl border-blue-200 bg-blue-50 p-4 flex justify-between">
            <div className="flex items-center">
                <span className="flex p-2 rounded-lg mr-4 bg-blue-500">
                    <SpeakerphoneIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </span>
                <NormalText className="text-blue-500">
                    You have been invited to project <span className="font-bold">{invitation.projectName}</span> by{' '}
                    <span className="font-bold">{invitation.invitedBy}</span>
                </NormalText>
            </div>
            <div className="flex">
                <NormalButton
                    loading={loading && type === 'decline'}
                    variant="tertiary"
                    className="mr-2 shadow"
                    title="Decline"
                    onClick={() => {
                        setType('decline');
                        respondToInvitation('decline');
                    }}
                />
                <NormalButton
                    loading={loading && type === 'accept'}
                    className="shadow"
                    title="Accept"
                    onClick={() => {
                        setType('accept');
                        respondToInvitation('accept');
                    }}
                />
            </div>
        </div>
    );
};
