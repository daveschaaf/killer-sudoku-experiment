import Layout from "../components/Layout";
import { btn, colors } from "../styles";

const PUZZLE_URL = "https://sudokupad.app/fpuzN4IgzglgXgpiBcA2ANCALhNAbO8QBkYBDAJwDsACAaQixxIoGUBXAEwHsBrZkVI5tAAt2JBCACyASQAijCgCYALAEZeIEsxxgYaMQDFaWCsQDGgiiZh0KAd0zmiFMswC2AIxgMAZiXYuKyhRo7BSIAHQAOmRRAKJEZhS+NsgW7FiuZClEZKwKAOsAzBRu7AAeFC7MYGipZGhEEJSm5s7unsal8dgAnhTsZJaR0WQAwlZYYBQA5r7MAA4wuY0UjiZEUzAVVTVgrkEhQputHgzLhxbrMICYBJPBcwC0OF41JiJknkNRAHIhx+0uRF6JBgCyINTsQmWq0uKRgADcYJQIF4goJNkkAPSvdIuShEOjsGyTTBhNQzCCsBAAbSpoDh+OYuAArABfZB0hm4RSoKYQBFkBBoDQwNkc9K4ZSikD08UIFAgXn8wXCqUyxkIAo8vmI5WM1WchDyLVK+BCvUAXWQtOlBqQ+tl8Hk9vV8E1Cu1AtNKvZNodimdzIDCEllutatwBSD8FZPvDCH9sdtksTDqdKZdiBZobFLrTOYlUcz6cDxfjUbdip1XotVvzZdLdobRvdJrNIobkYbybr0aztd9Lu7A4jxqrbajMZ7eeHcqj/vNlpAnEMnjWG2poEsdDA1JAACVlCNVKg9/Ij2o9wVz4u43hlIoQFKtxNdweRvIL4eCiAb7aQEzHx9Z8d3gKl9zPD8TyvSD9yvb8T0Ud8f1QW8QGUD8n3GECwL3RDj33JlrxQv9EEAzcsNfQiYL3RBzxPWiP1/B00IABjIkBgMokZ4P3WjvyYl0QAAdnYzjQP3RCeNwkYHwE3A0NUTDty4h96Jk5CZzwAClJfcS90IgC1IAuSxBEnTsIIkZSLU0iTLwABOUSKL0w9DP3Q9bOI5jtKA5ycLPNzTysjTUNI8zXyvQKr08zSQAADic5S9MQwLEJi1CzN8pKcMPVTwO4i8zzyy91LstCHyzFkgA";

export default function Puzzle1({ nextStep, currentStep }) {
  function openPuzzle() {
    window.open(PUZZLE_URL, "_blank");
  }

  return (
    <Layout currentStep={currentStep}>
      <h1 style={{ marginTop: 0 }}>Practice Puzzle</h1>
      <p style={{ color: colors.textSecondary, lineHeight: 1.7 }}>
        Now it's time to try a Killer Sudoku puzzle. This is a practice round — there's no time
        pressure and no right or wrong outcome. Use it to get familiar with the rules.
      </p>
      <p style={{ color: colors.textSecondary, lineHeight: 1.7 }}>
        Click the button below to open the puzzle in a new tab. When you're done exploring,
        come back here and click <strong>"I'm done"</strong> to continue.
      </p>

      <button onClick={openPuzzle} style={{ ...btn.primary, backgroundColor: colors.primary, marginBottom: 48 }}>
        Open Practice Puzzle
      </button>

      <div style={{ borderTop: `1px solid #e5e5e5`, paddingTop: 32, marginTop: 16 }}>
        <p style={{ color: colors.textSecondary, marginBottom: 16 }}>
          Finished with the practice puzzle? Click below to continue.
        </p>
        <button onClick={nextStep} style={{ ...btn.primary, backgroundColor: "#1a1a1a" }}>
          I'm done
        </button>
      </div>
    </Layout>
  );
}
