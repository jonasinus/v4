import { OutletProps } from '../../utility/types'
import { MainComponent } from '../main'
import { FooterNav } from '../nav/footer'
import { Topnav } from '../nav/top'

export function Outlet(props: OutletProps) {
    return (
        <>
            <Topnav {...props} />
            <MainComponent {...props} />
            {/*props.isMobile ? */ <FooterNav {...props} /> /* : <SidebarNav {...props} />*/}
        </>
    )
}
