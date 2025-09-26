import React, { useMemo, useRef, useEffect } from 'react';
import { Box, Typography, IconButton, Divider } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  Link,
  FormatListNumbered,
  FormatListBulleted,
  FormatAlignLeft,
  Code,
  FormatQuote,
} from '@mui/icons-material';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: boolean;
  helperText?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Digite sua descrição...',
  label,
  error = false,
  helperText,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const toolbarButtons = [
    { icon: <FormatBold />, command: 'bold', title: 'Negrito' },
    { icon: <FormatItalic />, command: 'italic', title: 'Itálico' },
    { icon: <FormatUnderlined />, command: 'underline', title: 'Sublinhado' },
    {
      icon: <FormatStrikethrough />,
      command: 'strikeThrough',
      title: 'Riscado',
    },
    { icon: <Link />, command: 'createLink', title: 'Link' },
    {
      icon: <FormatListNumbered />,
      command: 'insertOrderedList',
      title: 'Lista Numerada',
    },
    {
      icon: <FormatListBulleted />,
      command: 'insertUnorderedList',
      title: 'Lista com Marcadores',
    },
    {
      icon: <FormatAlignLeft />,
      command: 'justifyLeft',
      title: 'Alinhar à Esquerda',
    },
    {
      icon: <Code />,
      command: 'insertHTML',
      title: 'Código',
      value: '<code></code>',
    },
    {
      icon: <FormatQuote />,
      command: 'formatBlock',
      title: 'Citação',
      value: 'blockquote',
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {label && (
        <Typography
          variant="body2"
          sx={{
            mb: 1,
            color: error ? 'error.main' : 'text.primary',
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
      )}

      {/* Toolbar */}
      <Box
        sx={{
          border: error ? '1px solid #d32f2f' : '1px solid #c4c4c4',
          borderBottom: 'none',
          backgroundColor: '#424242',
          borderRadius: '8px 8px 0 0',
          color: '#ffffff',
          padding: '8px',
          display: 'flex',
          gap: '4px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {toolbarButtons.map((button, index) => (
          <React.Fragment key={index}>
            <IconButton
              size="small"
              onClick={() => executeCommand(button.command, button.value)}
              title={button.title}
              sx={{
                color: '#666',
                '&:hover': {
                  color: '#1976d2',
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                },
                '&:active': {
                  color: '#1976d2',
                  backgroundColor: 'rgba(25, 118, 210, 0.2)',
                },
              }}
            >
              {button.icon}
            </IconButton>
            {index === 3 && <Divider orientation="vertical" flexItem />}
            {index === 6 && <Divider orientation="vertical" flexItem />}
          </React.Fragment>
        ))}
      </Box>

      {/* Editor */}
      <Box
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        sx={{
          border: error ? '1px solid #d32f2f' : '1px solid #c4c4c4',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          minHeight: '25aqui 0px',
          padding: '12px',
          fontSize: '14px',
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          outline: 'none',
          backgroundColor: '#424242',
          color: '#ffffff',
          '&:focus': {
            borderColor: '#1976d2',
            boxShadow: '0 0 0 1px #1976d2',
          },
          '&:empty::before': {
            content: `"${placeholder}"`,
            color: '#999',
            fontStyle: 'normal',
          },
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            margin: '8px 0',
            fontWeight: 'bold',
          },
          '& p': {
            margin: '4px 0',
          },
          '& ul, & ol': {
            paddingLeft: '20px',
            margin: '4px 0',
          },
          '& li': {
            margin: '2px 0',
          },
          '& blockquote': {
            borderLeft: '4px solid #ccc',
            paddingLeft: '16px',
            margin: '8px 0',
            fontStyle: 'italic',
            color: '#666',
          },
          '& code': {
            backgroundColor: '#f5f5f5',
            padding: '2px 4px',
            borderRadius: '3px',
            fontFamily: 'monospace',
            fontSize: '0.9em',
          },
        }}
      />

      {helperText && (
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            color: error ? 'error.main' : 'text.secondary',
            display: 'block',
          }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};
