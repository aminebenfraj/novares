"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getAllTasks, deleteTask } from "../../apis/taskApi"
import { Button } from "../../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Plus, Pencil, Trash2, Eye } from "lucide-react"

const TaskList = () => {
  const [tasks, setTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const data = await getAllTasks()
      setTasks(data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id)
        fetchTasks()
      } catch (error) {
        console.error("Error deleting task:", error)
      }
    }
  }

  return (
    <div className="container p-4 mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Task List</h1>
        <Button asChild>
          <Link to="/add">
            <Plus className="w-4 h-4 mr-2" /> Add Task
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Manage and view your tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Responsible</TableHead>
                <TableHead>Planned</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell className="font-medium">{task.comments}</TableCell>
                  <TableCell>{task.responsible}</TableCell>
                  <TableCell>{new Date(task.planned).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => setSelectedTask(task)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Task Details</DialogTitle>
                            <DialogDescription>View the details of the selected task.</DialogDescription>
                          </DialogHeader>
                          {selectedTask && (
                            <div className="mt-4 space-y-4">
                              <p>
                                <strong>Task:</strong> {selectedTask.comments}
                              </p>
                              <p>
                                <strong>Responsible:</strong> {selectedTask.responsible}
                              </p>
                              <p>
                                <strong>Planned:</strong> {new Date(selectedTask.planned).toLocaleDateString()}
                              </p>
                              {/* Add more task details here */}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="icon" asChild>
                        <Link to={`/edit/${task._id}`}>
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(task._id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default TaskList

