import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Checkbox,
  FormControlLabel,
  Typography,
  Divider,
  IconButton
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { endOfDay } from 'date-fns';
import { Share as ShareIcon, Close as CloseIcon } from '@mui/icons-material';

const WEEKDAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

const REMINDER_OPTIONS = [
  { value: 0, label: 'None' },
  { value: 5, label: '5 minutes before' },
  { value: 15, label: '15 minutes before' },
  { value: 30, label: '30 minutes before' },
  { value: 60, label: '1 hour before' },
  { value: 1440, label: '1 day before' },
];

const EventForm = ({ open, onClose, onSave, event, categories, initialDate, isMobile }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date(),
    category: '',
    duration: 60,
    isAllDay: false,
    endDate: new Date(),
    repeat: 'never',
    repeatInterval: 1,
    repeatDays: [],
    repeatEndDate: null,
    repeatCount: null,
    repeatEndType: 'never',
    reminder: 0,
    shareWith: [],
  });

  const [shareEmail, setShareEmail] = useState('');

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        date: new Date(event.date),
        category: event.category || '',
        duration: event.duration || 60,
        isAllDay: event.isAllDay || false,
        endDate: event.endDate ? new Date(event.endDate) : new Date(new Date(event.date).getTime() + (event.duration || 60) * 60000),
        repeat: event.repeat || 'never',
        repeatInterval: event.repeatInterval || 1,
        repeatDays: event.repeatDays || [],
        repeatEndDate: event.repeatEndDate ? new Date(event.repeatEndDate) : null,
        repeatCount: event.repeatCount || null,
        repeatEndType: event.repeatEndType || 'never',
        reminder: event.reminder || 0,
        shareWith: event.shareWith || [],
      });
    } else {
      const now = initialDate ? new Date(initialDate) : new Date();
      const initialEndDate = new Date(now.getTime() + 60 * 60000);
      setFormData({
        title: '',
        description: '',
        date: now,
        category: '',
        duration: 60,
        isAllDay: false,
        endDate: initialEndDate,
        repeat: 'never',
        repeatInterval: 1,
        repeatDays: [],
        repeatEndDate: null,
        repeatCount: null,
        repeatEndType: 'never',
        reminder: 0,
        shareWith: [],
      });
    }
  }, [event, open, initialDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      ...formData,
      date: formData.date,
      endDate: formData.isAllDay ? endOfDay(formData.date) : formData.endDate,
    };
    onSave(eventData);
  };

  const handleShare = () => {
    if (!shareEmail) return;
    
    // In a real application, you would send an email invitation here
    // For now, we'll just add it to the shareWith array
    setFormData({
      ...formData,
      shareWith: [...formData.shareWith, shareEmail]
    });
    setShareEmail('');
  };

  const handleRemoveShare = (email) => {
    setFormData({
      ...formData,
      shareWith: formData.shareWith.filter(e => e !== email)
    });
  };

  const durationOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' },
    { value: 240, label: '4 hours' },
    { value: 480, label: '8 hours' },
  ];

  const renderRecurrenceOptions = () => {
    if (formData.repeat === 'never') return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom>
          Recurrence Details
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              type="number"
              label="Repeat every"
              value={formData.repeatInterval}
              onChange={(e) => setFormData({ ...formData, repeatInterval: parseInt(e.target.value) || 1 })}
              InputProps={{ inputProps: { min: 1 } }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {formData.repeat === 'daily' ? 'days' :
               formData.repeat === 'weekly' ? 'weeks' :
               formData.repeat === 'monthly' ? 'months' : 'times'}
            </Typography>
          </Grid>
        </Grid>

        {formData.repeat === 'weekly' && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Repeat on:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {WEEKDAYS.map((day) => (
                <FormControlLabel
                  key={day.value}
                  control={
                    <Checkbox
                      checked={formData.repeatDays.includes(day.value)}
                      onChange={(e) => {
                        const newDays = e.target.checked
                          ? [...formData.repeatDays, day.value]
                          : formData.repeatDays.filter(d => d !== day.value);
                        setFormData({ ...formData, repeatDays: newDays });
                      }}
                    />
                  }
                  label={day.label}
                />
              ))}
            </Box>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Ends</InputLabel>
            <Select
              value={formData.repeatEndType}
              onChange={(e) => setFormData({ ...formData, repeatEndType: e.target.value })}
              label="Ends"
            >
              <MenuItem value="never">Never</MenuItem>
              <MenuItem value="on">On</MenuItem>
              <MenuItem value="after">After</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {formData.repeatEndType === 'on' && (
          <Box sx={{ mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={formData.repeatEndDate}
                onChange={(newDate) => {
                  if (newDate) {
                    setFormData({ ...formData, repeatEndDate: newDate });
                  }
                }}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Box>
        )}

        {formData.repeatEndType === 'after' && (
          <Box sx={{ mt: 2 }}>
            <TextField
              type="number"
              label="Number of occurrences"
              value={formData.repeatCount}
              onChange={(e) => setFormData({ ...formData, repeatCount: parseInt(e.target.value) || null })}
              InputProps={{ inputProps: { min: 1 } }}
              fullWidth
            />
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      fullScreen={isMobile}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ 
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          py: { xs: 1.5, sm: 2 }
        }}>
          {event ? 'Edit Event' : 'Add Event'}
        </DialogTitle>
        <DialogContent sx={{ 
          p: { xs: 1.5, sm: 2 },
          '& > *': { mb: { xs: 1.5, sm: 2 } }
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              fullWidth
              size={isMobile ? "small" : "medium"}
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={isMobile ? 2 : 3}
              fullWidth
              size={isMobile ? "small" : "medium"}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Start Date & Time"
                    value={formData.date}
                    onChange={(newDate) => {
                      if (newDate) {
                        setFormData({ ...formData, date: newDate });
                      }
                    }}
                    sx={{ width: '100%' }}
                    slotProps={{
                      textField: {
                        size: isMobile ? "small" : "medium"
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Duration</InputLabel>
                  <Select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    label="Duration"
                    size={isMobile ? "small" : "medium"}
                  >
                    {durationOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                label="Category"
                size={isMobile ? "small" : "medium"}
              >
                {categories.map((category) => (
                  <MenuItem 
                    key={category.value} 
                    value={category.value}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: category.color
                      }}
                    />
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isAllDay}
                  onChange={(e) => setFormData({ ...formData, isAllDay: e.target.checked })}
                  size={isMobile ? "small" : "medium"}
                />
              }
              label="All Day"
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(newDate) => {
                  if (newDate) {
                    setFormData({ ...formData, endDate: newDate });
                  }
                }}
                sx={{ width: '100%' }}
                slotProps={{
                  textField: {
                    size: isMobile ? "small" : "medium"
                  }
                }}
              />
            </LocalizationProvider>
            <FormControl fullWidth>
              <InputLabel>Repeat</InputLabel>
              <Select
                value={formData.repeat}
                onChange={(e) => setFormData({ ...formData, repeat: e.target.value })}
                label="Repeat"
                size={isMobile ? "small" : "medium"}
              >
                <MenuItem value="never">Never</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>

            {renderRecurrenceOptions()}

            <FormControl fullWidth>
              <InputLabel>Reminder</InputLabel>
              <Select
                value={formData.reminder}
                onChange={(e) => setFormData({ ...formData, reminder: e.target.value })}
                label="Reminder"
                size={isMobile ? "small" : "medium"}
              >
                {REMINDER_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Divider />
            <Typography variant="subtitle1" gutterBottom>
              Share Event
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Email"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                type="email"
                fullWidth
                size={isMobile ? "small" : "medium"}
              />
              <Button
                variant="contained"
                onClick={handleShare}
                startIcon={<ShareIcon />}
                size={isMobile ? "small" : "medium"}
              >
                Share
              </Button>
            </Box>
            {formData.shareWith.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" gutterBottom>
                  Shared with:
                </Typography>
                {formData.shareWith.map((email) => (
                  <Box
                    key={email}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <Typography variant="body2">{email}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveShare(email)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 1.5, sm: 2 },
          gap: { xs: 1, sm: 2 }
        }}>
          <Button 
            onClick={onClose}
            size={isMobile ? "small" : "medium"}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            size={isMobile ? "small" : "medium"}
          >
            {event ? 'Update' : 'Add'} Event
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventForm; 