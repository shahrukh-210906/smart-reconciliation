# **SmartRec \- Intelligent Reconciliation System**

SmartRec is a high-performance MERN stack application designed to automate the reconciliation of large-volume financial datasets. It compares external user files against an internal "System Truth" (Database) to identify matches, discrepancies, and missing records.

## **🚀 Key Features**

* **High-Volume Processing:** Capable of ingesting and matching 50,000+ transaction records in seconds.  
* **Role-Based Access:**  
  * **Admin:** Can update the "System Truth" (internal database) and view audit logs.  
  * **Analyst:** Can upload daily files for reconciliation and resolve discrepancies.  
  * **Viewer:** Read-only access to dashboards.  
* **Real-Time Analytics:** Interactive Dashboard with Pie & Bar charts showing match percentages.  
* **Automated Matching Logic:**  
  * **Exact Match:** IDs and Amounts match perfectly.  
  * **Partial Match:** IDs match, but amounts differ slightly (\<2% variance).  
  * **Unmatched:** ID exists but amount differs significantly, or ID does not exist.  
* **Audit Trail:** Immutable logs of all uploads and manual resolutions.

## **📂 Data Folder & Test Files**

To help you test the system's performance and logic, we have provided a data/ folder containing three key files:

| File Name | Description | Recommended Usage |
| :---- | :---- | :---- |
| **system\_record.csv** | A large dataset containing **50,000 unique records**. This acts as your "Internal Database" or Ledger. | **Admin Only:** Upload this via the "Update System Records" feature to populate the database. |
| **matched\_test.csv** | A file containing the first 10,000 records from Master1.csv. | **Analyst/User:** Upload this to verify successful reconciliation ("Green" matches). |
| **unmatched\_test.csv** | A file containing manipulated data (different amounts, wrong IDs). | **Analyst/User:** Upload this to test "Red" (Unmatched) and "Yellow" (Partial) results. |

## **🛠️ Installation & Setup**

### **1\. Prerequisites**

Ensure you have the following installed:

* **Node.js** (v14 or higher)  
* **MongoDB** (Local or Atlas)

### **2\. Backend Setup**

cd backend  
npm install  
\# Create a .env file with your MONGO\_URI and JWT\_SECRET  
\# Example: MONGO\_URI=mongodb://localhost:27017/smart\_rec\_db  
node server.js

### **3\. Frontend Setup**

\# In a new terminal  
cd ..  
npm install  
npm run dev

## **📖 How to Use (Step-by-Step Guide)**

### **Step 1: Initialize the System (Admin Only)**

*Before any reconciliation can happen, the system needs a "Source of Truth".*

1. **Log in as Admin**  
   * Email: admin@test.com  
   * Password: password123  
2. Navigate to the **Dashboard**.  
3. Locate the dark blue box labeled **"Update System Records"**.  
4. Click **"Upload Master CSV"**.  
5. Select the file: data/Master1.csv (The 50k record file).  
6. **Wait:** The system will process and insert 50,000 records into MongoDB. You will see a success message when done.

### **Step 2: Run a Reconciliation (Analyst)**

*Now verify that the system can correctly identify matches.*

1. **Log in as Analyst** (or remain as Admin).  
   * Email: analyst@test.com  
   * Password: password123  
2. Go to the **"Upload & Map"** tab.  
3. Upload the file: data/matched\_test.csv.  
4. **Map the Columns:** Ensure the dropdowns match your CSV headers (e.g., Transaction ID \-\> TransactionID).  
5. Click **"Start Reconciliation"**.  
6. **Result:**  
   * You should see a table full of **Matched (Green)** records.  
   * The Dashboard will update to show 10,000 matched records.

### **Step 3: Test Discrepancies**

*Verify that the system correctly flags errors.*

1. Go to **"Upload & Map"**.  
2. Upload data/unmatched\_test.csv.  
3. Map columns and click **Start**.  
4. **Result:**  
   * **Unmatched (Red):** Records where amounts don't match the system.  
   * **Partial Match (Yellow):** Records with small variance (\<2%).  
   * **Duplicate (Purple):** Records uploaded more than once in the same file.

## **📊 Troubleshooting**

* **"400 Bad Request" on Upload:** Ensure you mapped *all* mandatory columns (Transaction ID and Amount) before clicking Start.  
* **"System Records Empty":** Make sure you ran Step 1 (Admin Upload) before trying to reconcile.  
* **"Duplicate File":** The system prevents re-uploading the exact same file to avoid duplicate data. To test again, rename the file or add a new row.