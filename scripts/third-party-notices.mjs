import { readFileSync } from 'node:fs';

const document = readFileSync(new URL('../THIRD_PARTY_NOTICES.md', import.meta.url), 'utf8');
const notice = document.match(/```text\r?\n([\s\S]*?)\r?\n```/)[1].replaceAll('\r\n', '\n');

export const THIRD_PARTY_NOTICE = `/*! ${notice}\n*/`;
