import { Gitlab } from '@gitbeaker/rest';

export const gitlab = new Gitlab({
    host: import.meta.env.VITE_GITLAB_HOST,
    token: import.meta.env.VITE_GITLAB_TOKEN
})