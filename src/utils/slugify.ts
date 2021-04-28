import kebabCase from 'lodash/kebabCase';
import deburr from 'lodash/deburr';

export default function slugify(str: string): string {
  return kebabCase(deburr(str));
}
