import {
  Body1,
  Card,
  CardContent,
  CardHeader,
  H6,
  IconButton,
  ProgressLinear,
} from 'ui-neumorphism';
import { FaEllipsisV as SettingIcon } from 'react-icons/fa';

import { CloseTab } from 'src/models/close-tab.interface';
import { formatDuration, secToDuration } from 'src/utils/commons';
import { useState } from 'react';
import { List, ListItem } from 'src/components/Common/List';

interface CloseTabItemProps {
  item: CloseTab;
  deleteCloseTab: (name: string) => void;
  // decreaseRemainTime: (name: string) => void;
}

export default function CloseTabItem({
  item,
  deleteCloseTab,
}: // decreaseRemainTime,
CloseTabItemProps) {
  const durationObj = secToDuration(item.duration);

  const [openSetting, setOpenSetting] = useState(false);

  const handleDeleteButton = async () => {
    await deleteCloseTab(item.name);
  };

  // useEffect(() => {
  //   if (item) {
  //     setTimeout(() => {
  //       decreaseRemainTime(item.name);
  //     }, 1000);
  //   }
  // }, [decreaseRemainTime, item]);

  return (
    <Card className="px-2 py-1 position-relative">
      <CardHeader title={item.name} />
      <div className="position-absolute" style={{ top: 20, right: 50 }} hidden={!openSetting}>
        <List>
          <ListItem onClick={() => alert('Edit')}>Edit</ListItem>
          <ListItem onClick={handleDeleteButton}>Delete</ListItem>
        </List>
      </div>

      <div className="position-absolute" style={{ top: 20, right: 10 }}>
        <IconButton onClick={() => setOpenSetting(!openSetting)}>
          <SettingIcon />
        </IconButton>
      </div>
      <CardContent>
        <div className="row">
          <H6 className="col-8">
            <a href={item.url}>{item.url}</a>
          </H6>
          <Body1 className="col-4 text-end">{formatDuration(durationObj)}</Body1>
        </div>
        <div className="row">
          <div className="col">
            <ProgressLinear value={(item.duration / item.duration) * 100} color="var(--primary)" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
