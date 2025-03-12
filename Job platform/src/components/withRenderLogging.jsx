import React, { useEffect } from 'react';

function withRenderLogging(WrappedComponent) {
  return function WithRenderLogging(props) {
    useEffect(() => {
      console.log(`${WrappedComponent.name} рендерится`);
      const start = performance.now();

      return () => {
        const end = performance.now();
        console.log(`${WrappedComponent.name} рендер завершён за ${end - start} мс.`);
      };
    });

    return <WrappedComponent {...props} />;
  };
}

export default withRenderLogging;
