import '@coreui/coreui/dist/css/coreui.min.css'
import { CSidebar ,CSidebarBrand,CSidebarHeader ,CSidebarNav,CSidebarToggler,CNavItem,CNavTitle,CBadge,CNavGroup,CButton, CRow,CCl} from '@coreui/react'
import {CIcon} from '@coreui/icons-react';
import {cilHome,cilSearch,cilChatBubble,cilUser,cilLibraryAdd} from '@coreui/icons';

const NavBar = () => {
    return (
        <><CSidebar className="sidebar-fixed border-end width-xl text-white border border-dark p-3">
            <CSidebarHeader className="border-bottom">
              <CSidebarBrand>TalkThread</CSidebarBrand>
            </CSidebarHeader>
            <CSidebarNav>
              <CNavItem href="#"><CIcon customClassName="nav-icon" icon={cilHome} /> Home</CNavItem>
              <CNavItem href="/search"><CIcon customClassName="nav-icon" icon={cilSearch} /> Search </CNavItem>
              <CNavItem href="/chat"><CIcon customClassName="nav-icon" icon={cilChatBubble} /> Chat</CNavItem>
              <CNavItem href="/add"><CIcon customClassName="nav-icon" icon={cilLibraryAdd} /> Add</CNavItem>
              <CNavItem href="/profile"><CIcon customClassName="nav-icon" icon={cilUser} /> Profile</CNavItem>
            </CSidebarNav>
            <CSidebarHeader className="border-top">
              <CButton as="input" type="button" color="primary" value="LogOut" />
            </CSidebarHeader>
      </CSidebar></>
    );
}

export default NavBar;