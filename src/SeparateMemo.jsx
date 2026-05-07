import { memo, useState, useRef, useEffect } from 'react';

// Pattern B: function defined first, memo applied on export.
//
// Expected: same behavior as InlineMemo.jsx — these are functionally identical components.
// Actual:   eslint-plugin-react-hooks@7.1.1 DOES report violations here:
//
//   react-hooks/refs: Cannot access refs during render.
//   react-hooks/set-state-in-effect: Calling setState synchronously within an effect
//                                    can trigger cascading renders.
function SeparateMemoComponent({ value }) {
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  // react-hooks/refs fires here (line flagged by linter)
  const currentNode = containerRef.current;

  useEffect(() => {
    if (value) {
      // react-hooks/set-state-in-effect fires here (line flagged by linter)
      setHeight(value);
    }
  }, [value]);

  return (
    <div ref={containerRef} style={{ height }}>
      {currentNode ? value : null}
    </div>
  );
}

export default memo(SeparateMemoComponent);
