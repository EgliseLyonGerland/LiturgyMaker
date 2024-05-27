import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  ThemeProvider,
} from '@mui/material'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import copy from 'clipboard-copy'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import syntaxStyles from 'react-syntax-highlighter/dist/esm/styles/prism/a11y-dark'

import { darkTheme } from '../theme'

function Content({ className, code }: { className?: string, code: string }) {
  return (
    <SyntaxHighlighter className={className} language="js" style={syntaxStyles}>
      {code}
    </SyntaxHighlighter>
  )
}

interface Props {
  code: string
  open: boolean
  onHide: () => void
}

function CodeDialog({ code, open, onHide = () => void 0 }: Props) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  })

  const handleCopy = () => {
    copy(code)
    setCopied(true)
  }

  return createPortal(
    <ThemeProvider theme={darkTheme}>
      <Dialog
        fullWidth
        maxWidth={false}
        open={open}
        sx={{
          '& .MuiDialog-paper': {
            bgcolor: 'background.default',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            onClick={handleCopy}
            size="small"
            style={{ width: 250 }}
            variant="contained"
          >
            {copied ? 'Copié !' : 'Copier dans le presse-papier'}
          </Button>
          <IconButton onClick={onHide} size="large">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'transparent' }}>
          <Box
            code={code}
            component={Content}
            sx={{
              margin: '0 !important',
              borderRadius: '0 !important',
              minHeight: '100%',
              background: 'transparent !important',
            }}
          />
        </DialogContent>
      </Dialog>
    </ThemeProvider>,
    document.body,
  )
}

export default CodeDialog
