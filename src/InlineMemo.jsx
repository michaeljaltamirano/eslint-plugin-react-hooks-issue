import { memo, useState, useRef, useEffect } from 'react';

// memo wraps the function definition inline.
//
// Expected: react-hooks/set-state-in-effect and react-hooks/refs should fire.
// Actual:   eslint-plugin-react-hooks@7.1.1 reports NO violations here.
const InlineMemoComponent = memo(function InlineMemoComponent({ value }) {
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  // react-hooks/refs: accessing ref.current during render
  const currentNode = containerRef.current;

  useEffect(() => {
    if (value) {
      // react-hooks/set-state-in-effect: synchronous setState inside an effect
      setHeight(value);
    }
  }, [value]);

  return (
    <div ref={containerRef} style={{ height }}>
      {currentNode ? value : null}
    </div>
  );
});

export default InlineMemoComponent;
