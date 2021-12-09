import * as React from 'react';

export const CustomDatePicker = (props: React.HTMLProps<HTMLInputElement>, ref: React.Ref<HTMLInputElement>) => {
    return (
        <input
            {...props}
            className="mt-2 appearance-none rounded-md placeholder-gray-500 text-gray-900 relative block  px-3 py-2.5 border rounded focus:outline-none focus:ring-blue-500 border border-gray-300 focus:border-blue-500"
            value={props.value}
            ref={ref}
        />
    );
};
