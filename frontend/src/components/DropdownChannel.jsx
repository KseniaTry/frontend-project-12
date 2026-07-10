
import { useState } from "react";
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ChannelModal from "./ChannelModal";
import DeleteModal from "./DeleteModal";

const DropdownChannel = ({handleClickChannel, channel, isActive}) => {
  const {t} = useTranslation()
  const [renameModalShow, setRenameModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);

  return (
    <>
      <Dropdown as={ButtonGroup} className='d-flex d-flex align-items-center justify-content-between w-100 mb-1'>
        <Button
          variant="secondary" 
          onClick={() => handleClickChannel(channel.id)} 
          className= {`text-start text-dark bg-transparent p-0 border-0 shadow-none w-100 ${isActive ? 'text-white' : 'text-dark'}`}>
          # {channel.name}
        </Button>
        <Dropdown.Toggle
          variant='secondary'
          id="dropdown-channel" 
          className={`bg-transparent p-0 border-0 shadow-none ${isActive ? 'text-white' : 'text-dark'}`}>
          <span className="visually-hidden">{t('channelModal.renameName')}</span>
        </Dropdown.Toggle>

        <Dropdown.Menu className='w-100'>
          <Dropdown.Item as='button' 
            onClick={() => setRenameModalShow(true)}>
            {t('rename')}
          </Dropdown.Item>
          <Dropdown.Item as='button' 
            onClick={() => setDeleteModalShow(true)}>
            {t('delete')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <ChannelModal 
        show={renameModalShow} 
        onHide={() => setRenameModalShow(false)} 
        type='rename'/>
      <DeleteModal 
        show={deleteModalShow} 
        onHide={() => setDeleteModalShow(false)} 
        channel={channel}/>
    </>

  )
}

export default DropdownChannel