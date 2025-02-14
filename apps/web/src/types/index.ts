export interface BrainLinkModalType {
    show: boolean;
    link: string | null;
}

export interface SetLinkType {
    id: string;
    link: string;
    title: string;
    tags: TagsType[];
}

export interface TagsType {
    _id?: string;
    title: string;
}

export interface ContentType {
    contentId?: string;
    title: string;
    link: string;
    tags: TagsType[];
}
