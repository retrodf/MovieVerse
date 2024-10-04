const Series = require('../models/seriesModel');

const SeriesController = {
  // Mendapatkan semua series yang belum di-approve (approval_status = 0)
  getUnapprovedSeries: async (req, res) => {
    try {
      const series = await Series.getAll();
      const unapprovedSeries = series.filter(s => s.approval_status === 0);
      res.json(unapprovedSeries);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving unapproved series' });
    }
  },

  // Mendapatkan semua series yang sudah di-approve (approval_status = 1)
  getApprovedSeries: async (req, res) => {
    try {
      const series = await Series.getAll();
      const approvedSeries = series.filter(s => s.approval_status === 1);
      res.json(approvedSeries);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving approved series' });
    }
  },

  // Mendapatkan semua series, baik yang sudah di-approve maupun belum
  getAllSeries: async (req, res) => {
    try {
      const series = await Series.getAll();
      res.json(series);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving all series' });
    }
  },

  // Menambahkan series baru
  createSeries: async (req, res) => {
    try {
      const seriesData = req.body;
      const newSeriesId = await Series.create(seriesData);
      res.status(201).json({ message: 'Series created', id: newSeriesId });
    } catch (error) {
      res.status(500).json({ message: 'Error creating series' });
    }
  },

  // Mengupdate approval status
  updateApprovalStatus: async (req, res) => {
    try {
      const { approval_status } = req.body;
      const result = await Series.update(req.params.id, { approval_status });
      if (result === 0) {
        return res.status(404).json({ message: 'Series not found' });
      }
      res.json({ message: 'Approval status updated' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating approval status' });
    }
  },

  // Menghapus series
  deleteSeries: async (req, res) => {
    try {
      const result = await Series.delete(req.params.id);
      if (result === 0) {
        return res.status(404).json({ message: 'Series not found' });
      }
      res.json({ message: 'Series deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting series' });
    }
  }
};

module.exports = SeriesController;
