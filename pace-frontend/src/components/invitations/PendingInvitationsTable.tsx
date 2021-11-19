import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useFetchInvitationsForProject } from '../../hooks/useFetchInvitationsForProject';
import InvitationService from '../../services/InvitationService';
import NormalText from '../common/NormalText';
import { WarningPopUp } from '../layout/WarningPopUp';
import { ProjectBadge } from '../project/ProjectBadge';

interface PendinginvitationTableProps {
    invitationsIds: string[];
}

export const PendingInvitationTable: React.FC<PendinginvitationTableProps> = ({ invitationsIds }) => {
    const { invitations } = useFetchInvitationsForProject(invitationsIds);
    const [loading, setLoading] = useState(false);
    const [waringPopUpVisible, setWarningPopUpVisible] = useState(false);
    const [invitationId, setInvitationId] = useState('');
    if (!invitations || !invitations.length) return null;

    const handleInvitationDelete = async (invitationId: string) => {
        try {
            setLoading(true);
            await InvitationService.deleteInvitation(invitationId);
            toast.success('Invitation deleted');
        } catch (errr) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex mt-10 sm:mb-4 justify-between">
                <NormalText className="text-xl">Pending invitations</NormalText>
            </div>

            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow-md overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-white">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Email
                                        </th>

                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Role
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Invited by
                                        </th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {invitations.map((i) => (
                                        <tr key={i.uid}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <NormalText>{i.email}</NormalText>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <ProjectBadge role={i.role} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <NormalText>{i.invitedBy}</NormalText>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => {
                                                        setInvitationId(i.uid);
                                                        setWarningPopUpVisible(true);
                                                    }}
                                                    className="text-blue-500 hover:text-indigo-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <WarningPopUp
                    action="Delete"
                    isOpen={waringPopUpVisible}
                    onClose={() => setWarningPopUpVisible(false)}
                    onAction={async () => {
                        handleInvitationDelete(invitationId);
                        setWarningPopUpVisible(false);
                    }}
                    header="Are you sure to delete this invitation?"
                    loading={loading}
                    text="You will have to invite this user again"
                />
            </div>
        </div>
    );
};
