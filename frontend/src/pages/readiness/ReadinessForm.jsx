// ReadinessCreatePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReadiness } from './readinessApi';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const ReadinessCreatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    status: '',
    project_name: '',
    description: '',
    assignedRole: '',
    assignedEmail: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleStatusChange = (value) => {
    setFormData(prevState => ({
      ...prevState,
      status: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReadiness(formData);
      toast({
        title: "Readiness Created",
        description: "The readiness entry has been successfully created.",
      });
      navigate('/readiness');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create readiness entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Create Readiness Entry</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <Select onValueChange={handleStatusChange} value={formData.status}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="on-going">On-going</SelectItem>
              <SelectItem value="stand-by">Stand-by</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="project_name" className="block text-sm font-medium text-gray-700">Project Name</label>
          <Input
            type="text"
            name="project_name"
            value={formData.project_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="assignedRole" className="block text-sm font-medium text-gray-700">Assigned Role</label>
          <Input
            type="text"
            name="assignedRole"
            value={formData.assignedRole}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="assignedEmail" className="block text-sm font-medium text-gray-700">Assigned Email</label>
          <Input
            type="email"
            name="assignedEmail"
            value={formData.assignedEmail}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit">Create Readiness</Button>
      </form>
    </div>
  );
};

export default ReadinessCreatePage;