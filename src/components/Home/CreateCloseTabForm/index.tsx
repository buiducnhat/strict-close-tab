import { useState } from 'react';
import { Button, Card, CardContent, CardHeader, Dialog, TextField } from 'ui-neumorphism';

import { CloseTab } from 'src/models/close-tab.interface';
import { minutesToSeconds } from 'date-fns';

interface CreateCloseTabFormProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  createCloseTab: (closeTab: CloseTab) => void;
}

export default function CreateCloseTabForm({
  visible,
  setVisible,
  createCloseTab,
}: CreateCloseTabFormProps) {
  const closeForm = () => setVisible(false);

  const [closeTabInput, setCloseTabInput] = useState<CloseTab>({
    name: '',
    url: '',
    duration: 0,
    description: '',
    isActive: true,
  });

  const handleSubmitButton = async () => {
    await createCloseTab({
      ...closeTabInput,
      duration: minutesToSeconds(closeTabInput.duration),
    });
    closeForm();
  };

  return (
    <Dialog visible={visible} onClose={closeForm}>
      <Card className="p-2">
        <div className="container">
          <CardHeader style={{ color: 'var(--primary)' }} title="Create item" />

          <CardContent>
            <div className="row mb-1">
              <div className="col">
                <TextField
                  className="m-0"
                  label="Name (Unique)"
                  value={closeTabInput.name}
                  onChange={(e: any) =>
                    setCloseTabInput({ ...closeTabInput, name: e.event.target.value })
                  }
                />
              </div>
            </div>

            <div className="row mb-1">
              <div className="col">
                <TextField
                  className="m-0"
                  label="URL (facebook.com)"
                  value={closeTabInput.url}
                  onChange={(e: any) =>
                    setCloseTabInput({ ...closeTabInput, url: e.event.target.value })
                  }
                />
              </div>
            </div>

            <div className="row mb-1">
              <div className="col">
                <TextField
                  className="m-0"
                  label="Duration (in minutes)"
                  type="number"
                  value={closeTabInput.duration ? closeTabInput.duration.toString() : ''}
                  onChange={(e: any) =>
                    setCloseTabInput({ ...closeTabInput, duration: +e.event.target.value })
                  }
                />
              </div>
            </div>

            <div className="row mb-1">
              <div className="col">
                <TextField
                  className="m-0"
                  label="Description (optional)"
                  value={closeTabInput.description}
                  onChange={(e: any) =>
                    setCloseTabInput({ ...closeTabInput, description: e.event.target.value })
                  }
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col d-flex justify-content-end">
                <Button className="me-3" color="var(--error)" onClick={closeForm}>
                  Cancel
                </Button>
                <Button color="var(--primary)" onClick={handleSubmitButton}>
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Dialog>
  );
}
