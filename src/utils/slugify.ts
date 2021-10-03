import deburr from 'lodash/deburr';
import kebabCase from 'lodash/kebabCase';

export default function slugify(str: string): string {
  return kebabCase(deburr(str));
}
