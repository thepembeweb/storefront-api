export const TIMEOUT_INTERVAL = 10000;

export enum OrderStatus {
  ACTIVE = 'active',
  COMPLETE = 'complete'
}

export const toCamelCase = (value: string) => {
  return value.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
};

export const renameProp = (
  oldProp: string | number,
  newProp: string | number,
  { [oldProp]: oldValue, ...rest }
) => ({
  [newProp]: oldValue,
  ...rest
});

export const formatRowColumns = (data: unknown) => {
  let updatedData = data as any;

  const columns = Object.keys(updatedData);

  for (const column of columns) {
    if (column.indexOf('_') !== -1) {
      updatedData = renameProp(column, toCamelCase(column), updatedData);
    }
  }

  return updatedData;
};

type ErrorDetail = {
  status: number;
  message: string;
};

export const handleError = (error: unknown): ErrorDetail => {
  let errorMessage = 'Unexpected error occurred.';

  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error instanceof Error) {
    errorMessage = error.message || 'Bad request.';
  }

  return {
    status: 400,
    message: errorMessage
  };
};
