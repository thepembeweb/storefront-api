import {
  formatRowColumns,
  handleError,
  toCamelCase,
  renameProp
} from '../../utils/common-utils';

describe('Tests for Common Utils', () => {
  describe('function formatRowColumns parses row object into a json, camelcase format', () => {
    it(`should parse row object into a json, camelcase format`, () => {
      const mockValue = {
        id: 1,
        username: 'user123',
        first_name: 'Joe',
        last_name: 'Bloggs',
        password_digest:
          '$2b$10$nWOTlrqREl17nLvksLA4hOsZKGY1UpDCSiIfZ9D6kRwt0iDslbFu2'
      };
      const mockExpectedResult = {
        id: 1,
        username: 'user123',
        firstName: 'Joe',
        lastName: 'Bloggs',
        passwordDigest:
          '$2b$10$nWOTlrqREl17nLvksLA4hOsZKGY1UpDCSiIfZ9D6kRwt0iDslbFu2'
      };

      const result = formatRowColumns(mockValue);
      const expected = mockExpectedResult;
      expect(result).toEqual(expected);
    });
  });

  describe('function handleError returns a parsed error object', () => {
    it(`should receive input of 'abcde' and be false`, () => {
      const mockErrorMessage = 'Custom error occurred!';
      const mockValue = new Error(mockErrorMessage);
      const mockExpectedResult = {
        status: 400,
        message: mockErrorMessage
      };

      const result = handleError(mockValue);
      const expected = mockExpectedResult;
      expect(result).toEqual(expected);
    });
  });

  describe('function toCamelCase converts the supplied input value to camelcase', () => {
    it(`should receive input of 'first_name' and be 'firstName'`, () => {
      const mockValue = 'first_name';
      const mockExpectedResult = 'firstName';

      const result = toCamelCase(mockValue);
      const expected = mockExpectedResult;
      expect(result).toEqual(expected);
    });
  });

  describe('function renameProp renames the property of the supplied object', () => {
    it(`should receive input of object with with 'first_name' prop and rename it to be 'firstName'`, () => {
      const mockOldPropValue = 'first_name';
      const mockNewPropValue = 'firstName';
      const mockValue = {
        id: 1,
        username: 'user123',
        first_name: 'Joe'
      };
      const mockExpectedResult = {
        id: 1,
        username: 'user123',
        firstName: 'Joe'
      };

      const result = renameProp(mockOldPropValue, mockNewPropValue, mockValue);
      const expected = mockExpectedResult;
      expect(result).toEqual(expected);
    });
  });
});
