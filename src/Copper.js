import React from 'react';

class App extends React.Component {
	constructor() {
        super();
        
        this.isDragging=false;

		this.state = {
			customStyle: {},
            _customeStringStyle: '',
		};
    }
    onMouseDown=(ev)=>{
        this.props.selectedCropper(this.props.dci)
        this.isSelected && this.props.toggelCropper(true)
        this.isDragging=true;
    }
    onMouseMove=(ev)=>{
        this.props.isSelected &&this.props.updateCropper(ev,this.props.dci)
    }
    onMouseUp=(ev)=>{
        this.isDragging=false;
        this.props.isSelected && this.props.toggelCropper(false)
    }

	render() {
		const { customStyle } = this.state;
		return (
			<div
                onMouseDown={this.onMouseDown}
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}
				className={`${this.props.isSelected?'border':''} `}
				style={{
					border: '1px dashed black',
					backgroundColor: 'yellow',
					position: 'absolute',
					cursor: this.isDragging?'grab':'pointer',
					...{ ...this.props },
					...{ ...customStyle }
				}}
			>
				<p>{`Reactivator_${this.props.dci} w:${this.props.width} h:${this.props.height} t:${this.props.top} l:${this.props.left}`}</p>
				<input
					onChange={(e) => this.setState({ _customeStringStyle: e.target.value })}
					value={this.state._customeStringStyle}
					multiple
				/>
				<input
					type={'button'}
					onClick={() => {
						this.setState({
							customStyle: JSON.parse('{' + this.state.customStyle + '}')
						});
					}}
					value={'Confirm'}
				/>
			</div>
		);
	}
}
export default App;
