import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'

export default function Modal({ title, onClose, children }) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
