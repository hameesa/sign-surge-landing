import React from 'react';

interface StylingProps {
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  spacing?: string;
}

const withStyling = (WrappedComponent: React.ComponentType<any>) => {
  const WithStyling = (props: any) => {
    const stylingProps: StylingProps = {
      backgroundColor: props.backgroundColor,
      textColor: props.textColor,
      padding: props.padding,
      spacing: props.spacing,
    };

    return (
      <div
        style={{
          backgroundColor: stylingProps.backgroundColor,
          color: stylingProps.textColor,
          padding: stylingProps.padding,
          margin: stylingProps.spacing,
        }}
      >
        <WrappedComponent {...props} />
      </div>
    );
  };

  return WithStyling;
};

export default withStyling;