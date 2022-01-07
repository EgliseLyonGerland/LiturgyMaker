import migrate from '../migrate';
import version2 from '../migrations/version2';
import version3 from '../migrations/version3';
import version4 from '../migrations/version4';
import version5 from '../migrations/version5';
import version6 from '../migrations/version6';
import version7 from '../migrations/version7';

jest.mock('../migrations/version2');
jest.mock('../migrations/version3');
jest.mock('../migrations/version4');
jest.mock('../migrations/version5');
jest.mock('../migrations/version6');
jest.mock('../migrations/version7');

beforeEach(() => {
  jest.clearAllMocks();

  version2.mockReturnValue('version 2');
  version3.mockReturnValue('version 3');
  version4.mockReturnValue('version 4');
  version5.mockReturnValue('version 5');
  version6.mockReturnValue('version 6');
  version7.mockReturnValue('version 7');
});

test('migrate() from version 1', () => {
  const result = migrate({ version: 1 });

  expect(result).toEqual('version 7');
  expect(version2).toHaveBeenCalledTimes(1);
  expect(version3).toHaveBeenCalledTimes(1);
  expect(version4).toHaveBeenCalledTimes(1);
  expect(version5).toHaveBeenCalledTimes(1);
  expect(version6).toHaveBeenCalledTimes(1);
  expect(version7).toHaveBeenCalledTimes(1);
});

test('migrate() from version 5', () => {
  const result = migrate({ version: 5 });

  expect(result).toEqual('version 7');
  expect(version2).not.toHaveBeenCalled();
  expect(version3).not.toHaveBeenCalled();
  expect(version4).not.toHaveBeenCalled();
  expect(version5).not.toHaveBeenCalled();
  expect(version6).toHaveBeenCalledTimes(1);
  expect(version7).toHaveBeenCalledTimes(1);
});

test('migrate() from version 7', () => {
  const result = migrate({ version: 7 });

  expect(result).toEqual({ version: 7 });
  expect(version2).not.toHaveBeenCalled();
  expect(version3).not.toHaveBeenCalled();
  expect(version4).not.toHaveBeenCalled();
  expect(version5).not.toHaveBeenCalled();
  expect(version6).not.toHaveBeenCalled();
  expect(version7).not.toHaveBeenCalled();
});
