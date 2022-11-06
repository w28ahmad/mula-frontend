These subfolders are really useful since they help keep your components organized into different sections instead of just being one massive blob of components. In our example we have a ui folder which contains all our UI components like buttons, modals, cards, etc. We also have a form folder for form specific controls like checkboxes, inputs, date pickers, etc.




TODO: REMOVE THIS AFTER USING PLS

  state = {
    isLoading: true,
    data: []
  };

  async componentDidMount() {
    const response = await fetch('/test2');
    const body = await response.json();
    this.setState({data: body, isLoading: false});
  }

  render() {
    const {data, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    return (
      <div className="App">
        <header className="App-header">
          <div className="App-intro">
            <h2>Coffee Shop List</h2>
            {data.map(data =>
              <div key={data.id}>
                {data.createdAt} - {data.partType}
              </div>
            )}
          </div>
        </header>
      </div>
    );
  }