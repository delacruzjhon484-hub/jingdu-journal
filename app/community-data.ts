export type CommunityRole = 'learner' | 'teacher';
export type CommunityProfile = { nickname: string; readingId?: string | null; role: CommunityRole; focus: string; bio: string; published: boolean; updatedAt: number };
export type CommunityMember = Omit<CommunityProfile, 'published' | 'updatedAt'>;
export const communityRoles = { learner: '英语学习爱好者', teacher: '英语老师' } as const;
export const communityEndpoint = '/api/community';
