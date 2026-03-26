interface Props {
  code: string;
}

export default function CodeBlock({ code }: Props) {
  return (
    <div className="bg-code-bg rounded-lg p-4 overflow-x-auto mt-3 border-l-4 border-[#569CD6]">
      <pre className="text-code-text font-mono text-xs leading-relaxed whitespace-pre">
        {code.split('\n').map((line, i) => {
          // Simple syntax highlighting
          const highlighted = line
            .replace(/(#.*$)/gm, '<span class="code-comment">$1</span>')
            .replace(/^(\s*-?\s*\w[\w.]*:)/gm, '<span class="code-key">$1</span>');
          return <span key={i} dangerouslySetInnerHTML={{ __html: highlighted + '\n' }} />;
        })}
      </pre>
    </div>
  );
}
