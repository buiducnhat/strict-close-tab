import { useState, useEffect } from 'react';
import { H5, Body1, Fab } from 'ui-neumorphism';
import Container from 'typedi';

import { CloseTab } from 'src/models/close-tab.interface';
import CloseTabItem from 'src/components/Home/CloseTabItem';
import CreateCloseTabForm from 'src/components/Home/CreateCloseTabForm';
import { CloseTabService } from 'src/services/close-tab.service';

export default function HomePage() {
  const [tab, setCurTab] = useState<chrome.tabs.Tab | null>(null);
  const [closeTabs, setCloseTabs] = useState<CloseTab[]>([]);
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);

  const getCloseTabs = () => {
    const closeTabService = Container.get(CloseTabService);
    closeTabService.getCloseTabs().then((result) => {
      setCloseTabs(result);
    });
  };

  // const updateCloseTab = (closeTab: CloseTab) => {
  //   const closeTabService = Container.get(CloseTabService);
  //   closeTabService.updateCloseTab(closeTab).then((result) => {
  //     if (!result) {
  //       alert('Error occurs while updating item');
  //     }
  //     getCloseTabs();
  //   });
  // };

  const createCloseTab = (closeTab: CloseTab) => {
    const closeTabService = Container.get(CloseTabService);
    closeTabService.createCloseTab(closeTab).then((result) => {
      if (!result) {
        alert('Error occurs while creating item');
      }
      getCloseTabs();
    });
  };

  const deleteCloseTab = (name: string) => {
    const closeTabService = Container.get(CloseTabService);
    closeTabService.deleteCloseTab(name).then((result) => {
      if (!result) {
        alert('Error occurs while deleting item');
      }
      getCloseTabs();
    });
  };

  useEffect(() => {
    chrome.tabs &&
      chrome.tabs.query({ active: true, lastFocusedWindow: true }).then((tabs) => {
        setCurTab(tabs[0]);
      });
    getCloseTabs();
  }, []);

  return (
    <div className="p-3" style={{ height: 500, overflowY: 'scroll' }}>
      <Fab
        fixed
        right
        style={{ top: '430px', zIndex: 1030 }}
        color="var(--primary)"
        onClick={() => setOpenCreateDialog(true)}
      >
        <span style={{ fontSize: '30px' }}>+</span>
      </Fab>

      <CreateCloseTabForm
        visible={openCreateDialog}
        setVisible={setOpenCreateDialog}
        createCloseTab={createCloseTab}
      />

      <H5 style={{ marginBottom: 10 }}>Strict Close Tab</H5>
      <Body1 style={{ marginBottom: 30 }}>
        Current URL: <a href={tab?.url}>{tab?.url}</a>
      </Body1>

      <div className="items">
        {closeTabs?.length ? (
          closeTabs.map((item, key) => (
            <div key={key} className="mb-3">
              <CloseTabItem
                item={item}
                deleteCloseTab={deleteCloseTab}
                // decreaseRemainTime={decreaseRemainTime}
              />
            </div>
          ))
        ) : (
          <H5>No data</H5>
        )}
      </div>
    </div>
  );
}
