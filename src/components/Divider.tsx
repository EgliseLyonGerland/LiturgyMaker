import AddIcon from '@mui/icons-material/Add'
import { Box, ButtonBase, useTheme } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'

import { blockTypes } from '../config/global'
import type { BlockType } from '../types'
import { isBlockType } from '../utils/liturgy'

interface Props {
  onBlockSelected: (block: BlockType) => void
  disabled: boolean
}

function Divider({ onBlockSelected, disabled = false }: Props) {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelect = (block: BlockType) => {
    handleClose()
    onBlockSelected(block)
  }

  return (
    <Box
      sx={{
        position: 'relative',
        height: 1,
        display: 'flex',
        alignItems: 'center',
        margin: theme.spacing(2, 0),
      }}
    >
      <Box
        sx={{
          'display': 'flex',
          'justifyContent': 'center',
          'alignItems': 'center',
          'opacity': 0.6,
          'width': '100%',
          'zIndex': 1,
          'transition': theme.transitions.create('opacity'),

          '&:before, &:after': {
            content: '""',
            position: 'absolute',
            height: '1px',
            backgroundImage:
              theme.palette.mode === 'dark'
                ? 'linear-gradient(to right, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0) 0%)'
                : 'linear-gradient(to right, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 0%)',
            backgroundPosition: 'bottom',
            backgroundSize: theme.spacing('8px', '1px'),
            backgroundRepeat: 'repeat-x',
            top: '50%',
          },
          '&:before': {
            left: 24,
            right: '50%',
            transform: 'translateX(-24px)',
          },
          '&:after': {
            left: '50%',
            right: 24,
            transform: 'translateX(24px)',
          },
          '&:hover': {
            opacity: disabled ? 'inherit' : 1,
          },
        }}
      >
        <ButtonBase
          disabled={disabled}
          onClick={(event) => {
            setAnchorEl(event.currentTarget)
          }}
          sx={{
            width: 32,
            height: 32,
            borderRadius: 16,
            background:
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.1)',
          }}
          title="Ajouter un bloc"
        >
          <AddIcon htmlColor="#aaa" />
        </ButtonBase>
        <Menu
          anchorEl={anchorEl}
          id="simple-menu"
          keepMounted
          onClose={handleClose}
          open={Boolean(anchorEl)}
        >
          {Object.entries(blockTypes).map(([name, label]) => (
            <MenuItem
              key={name}
              onClick={() => {
                if (isBlockType(name)) {
                  handleSelect(name)
                }
              }}
            >
              {label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  )
}

export default Divider
