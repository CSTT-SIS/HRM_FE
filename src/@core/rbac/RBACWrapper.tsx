import { useCallback } from 'react';

interface Props {
	permissionKey: string[];
	type: 'AND' | 'OR';
	children: React.ReactNode;
}

export const allowAccess = (permissionKey: string[], type: 'AND' | 'OR', permissions: string[]) => {
	if (type === 'AND') {
		return permissionKey.every((key) => permissions.includes(key));
	}
	if (type === 'OR') {
		return permissionKey.some((key) => permissions.includes(key));
	}
};
const permissions = ['user:read', 'user:write'];

const RBACWrapper = ({ permissionKey, type, children }: Props) => {
	// const {permission} = useProfile();

	const internalAllowAccess = useCallback(() => allowAccess(permissionKey, type, permissions), [permissionKey, type]);
	return <>{internalAllowAccess() && children}</>;
};
export default RBACWrapper;
