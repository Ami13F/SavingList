import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  ItemType,
  GetItemsResponse,
  ShoppingListDB,
} from "../sdk/shoppingListDB.sdk";
import "bootstrap/dist/css/bootstrap.css";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function AllTasks() {
  const [tasks, setTasks] = useState<ItemType[]>([]);
  const [todayItems, setTodayItems] = useState<ItemType[]>([]);
  const [soonItems, setSoonItems] = useState<ItemType[]>([]);
  const [laterItems, setLaterItems] = useState<ItemType[]>([]);

  const [category, setCategory] = useState<String>("");
  const [done, setDone] = useState<boolean>(false);

  const [modalAddTask, setModalAddTask] = useState(false);
  const toggleModalAddTask = () => {
    setModalAddTask(!modalAddTask);
    setTaskTitle("");
  };

  const [taskTitle, setTaskTitle] = useState("");

  useEffect(() => {
    ShoppingListDB.getItemsByCategory(category).then(
      (result: GetItemsResponse) => {
        if (result.success) {
          setTasks(result.items);
          setTodayItems(
            result.items.filter((item) => item.category === "Today")
          );
          setSoonItems(result.items.filter((item) => item.category === "Soon"));
          setLaterItems(
            result.items.filter((item) => item.category === "Long term")
          );
        }
      }
    );
  }, [category, taskTitle]);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await ShoppingListDB.addItem(taskTitle, category, done);
    if (res.success) {
      setTasks([...tasks, res.item!]);
      setTodayItems(
        [...tasks, res.item!].filter((item) => item.category === "Today")
      );
      setSoonItems(
        [...tasks, res.item!].filter((item) => item.category === "Soon")
      );
      setLaterItems(
        [...tasks, res.item!].filter((item) => item.category === "Long term")
      );
      setTaskTitle("");
      toggleModalAddTask();
    }
  }

  async function handleDone(id: string, done: boolean) {
    console.log("Client - item id: ", id, done);
    const res = await ShoppingListDB.updateItem(id, done);
    if (res.success) {
      setTaskTitle("");
    }
  }

  return (
    <>
      <Modal isOpen={modalAddTask} toggle={toggleModalAddTask}>
        <ModalHeader toggle={toggleModalAddTask}>Add new task</ModalHeader>
        <form onSubmit={(e) => handleAdd(e)}>
          <ModalBody>
            <div className="mb-3">
              <label className="form-label">Task Title</label>
              <Input
                className="form-control"
                placeholder="Title"
                autoComplete="off"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={["Today", "Soon", "Long term"]}
                onInputChange={(_, category) => {
                  setCategory(category);
                }}
                sx={{ width: 200 }}
                renderInput={(params) => (
                  <TextField {...params} label="Category" />
                )}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              Add
            </Button>
            <Button color="secondary" onClick={toggleModalAddTask}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>
      <Container className="mt-2">
        <Card className="p-4 mt-2">
          <Row className="mt-2">
            <Col sm="11">
              <h3>Shopping List</h3>
              <Row>
                <h3>Today: </h3>
                <Col sm="12">
                  {todayItems.map((task) => (
                    <div key={task._id} className="mb-3">
                      <p className="mb-0">
                        <Checkbox
                          onChange={(e, i) => {
                            handleDone(task._id, i);
                            e.target.checked = i;
                          }}
                          name="done"
                        />
                        <span className="h4">{task.name}</span> -{" "}
                      </p>
                    </div>
                  ))}
                </Col>
                <h3>Soon: </h3>
                <Col sm="12">
                  {soonItems.map((task) => (
                    <div key={task._id} className="mb-3">
                      <p className="mb-0">
                        <Checkbox
                          onChange={(e, i) => {
                            handleDone(task._id, i);
                            e.target.checked = i;
                          }}
                          name="done"
                        />
                        <span className="h4">{task.name}</span> -{" "}
                      </p>
                    </div>
                  ))}
                </Col>
                <h3>Long term: </h3>
                <Col sm="12">
                  {laterItems.map((task) => (
                    <div key={task._id} className="mb-3">
                      <p className="mb-0">
                        <Checkbox
                          onChange={(e, i) => {
                            handleDone(task._id, i);
                            e.target.checked = i;
                          }}
                          name="done"
                        />
                        <span className="h4">{task.name}</span> -{" "}
                      </p>
                    </div>
                  ))}
                </Col>
                <Col sm="3" className="mt-4">
                  <Button color="primary" onClick={toggleModalAddTask}>
                    Add Item
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
}
