import React from 'react';
import { ProjectMemberRole } from '../../models/projects.model';
import Badge from '../common/Badge';

interface ProjectBadgeProps {
    role: ProjectMemberRole;
}

export const ProjectBadge: React.FC<ProjectBadgeProps> = ({ role }) => {
    switch (role) {
        case ProjectMemberRole.EDITOR:
            return <Badge className="mt-1.5" color="purple" text={ProjectMemberRole.EDITOR.toLocaleUpperCase()} />;
        case ProjectMemberRole.OWNER:
            return <Badge className="mt-1.5" color="green" text={ProjectMemberRole.OWNER.toLocaleUpperCase()} />;
        case ProjectMemberRole.VIEWER:
            return <Badge className="mt-1.5" color="yellow" text={ProjectMemberRole.VIEWER.toLocaleUpperCase()} />;
    }
};
