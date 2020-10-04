/* eslint-disable */
// TODO: если не нужен удалить?
//
import React, { Component } from 'react';
import moment from 'moment';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import EventItem from '../components/EventItem';
import 'moment/locale/ru';
import './MainView.css';

class MainView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			allMapEvents: [],
			allListEvents: [],
			copied: false,
		};
	}

	componentDidMount() {
		const { googleEvents } = this.props;

		//
		// NOTE!
		// googleEvents - массив, каждый элемент которого является массивом событий
		// Тут собираем все события всех календарей в единый массив
		//

		let allMapEvents = [];
		const allListEvents = [];

		for (let i = 0; i < googleEvents.length; i++) {
			if (googleEvents[i]) {
				allMapEvents = [...allMapEvents, ...googleEvents[i].events];

				// allListEvents - единый массив событий из элементов { событие, имя календаря }
				const eventsArray = googleEvents[i].events;
				for (let j = 0; j < eventsArray.length; j++) {
					allListEvents.push({
						event: eventsArray[j],
						calendarName: googleEvents[i].calendarName,
					});
				}
			}
		}

		//
		// NOTE!
		// Почему-то функция sort() не работает
		// Ручками "метод пузырька"
		// TODO: разобраться с этим --> Пофиксил! "=" заменил на ">"
		if (allListEvents.length > 1) {
			for (let i = 0; i < allListEvents.length - 1; i++) {
				for (let j = i + 1; j < allListEvents.length; j++) {
					const a = allListEvents[i];
					const b = allListEvents[j];
					if (a.event.start.dateTime > b.event.start.dateTime) {
						const tmp = allListEvents[i];
						allListEvents[i] = allListEvents[j];
						allListEvents[j] = tmp;
					}
				}
			}
		}

		this.setState({
			allMapEvents,
			allListEvents,
		});
	}

	displayEvent(event, nameCalendar) {
		console.log('*** DISPLAY EVENT', event);
		return (
			<li className="list-item" key={event.id}>
				<EventItem
					getEvent={this.props.getEvent}
					googleEvent={event}
					name={nameCalendar}
				/>
			</li>
		);
	}

	//
	// NOTE!
	// This method is a copy of the exact one in EventItem.js
	//
	// TODO: refactor code and remove code duplication
	//
	getLocation = event => {
		let location = 'Не указано';

		if (event.location) {
			const secondCommaPosition = event.location.indexOf(
				',',
				event.location.indexOf(',', 0) + 1,
			);

			if (secondCommaPosition > 0) {
				location = event.location.substr(0, secondCommaPosition);
			} else {
				location = event.location;
			}
		}

		return location;
	};

	//
	// NOTE!
	// This method is a copy of the exact one in EventItem.js
	//
	// TODO: refactor code and remove code duplication
	//
	getEndTime = event => {
		let endDate = 'Не указано';

		if (event.end && event.end.dateTime) {
			endDate = moment(event.end.dateTime).format('HH:mm');
		}

		return endDate;
	};

	//
	// NOTE!
	// This method is a copy of the exact one in EventItem.js
	//
	// TODO: refactor code and remove code duplication
	//
	getStartTime = event => {
		let startDate = 'Не указано';

		if (event.start && event.start.dateTime) {
			startDate = moment(event.start.dateTime).format('HH:mm');
		}

		return startDate;
	};

	//
	// NOTE!
	// This method is a copy of the exact one in EventItem.js
	//
	// TODO: refactor code and remove code duplication
	//
	getStartDate = event => {
		let startDate = 'Не указано';

		if (event.start && event.start.dateTime) {
			startDate = moment(event.start.dateTime).format('D MMMM, dddd');
		}

		return startDate;
	};

	//
	// NOTE!
	// This method is a copy of the exact one in EventItem.js
	//
	// TODO: refactor code and remove code duplication
	//
	getClipboardTextForEvent = event => {
		const startDate = this.getStartDate(event);
		const startTime = this.getStartTime(event);
		const endTime = this.getEndTime(event);
		const summary = event.summary || 'Не указано';
		const location = this.getLocation(event);
		const details = `📅 ${startDate} 🕗 ${startTime} - ${endTime} － «${summary}» 📍${location}`;

		const url = `http://events4friends.ru/#/event/${event.id}/`;

		const clipboardText = `${details} ( [Подробнее...](${url}) )`;

		return clipboardText;
	};

	getClipboardText = () => {
		const { allListEvents } = this.state;

		let clipboardText = 'Список предстоящих мероприятий: \n\n';

		allListEvents.forEach(event => {
			clipboardText += this.getClipboardTextForEvent(event.event);
			clipboardText += '\n\n';
		});

		clipboardText += 'Еще больше информации на сайте events4friends.ru';

		return clipboardText;
	};

	//
	// NOTE!
	// The event's data is copied with the help of the ClipboardJS.
	// See "data-clipboard-text" attribute and https://clipboardjs.com/ for more details.
	//
	// This method contains only animation.
	//
	animateCopyingAllEvents() {
		this.setState({ copied: true });
		this.timer = setTimeout(() => {
			this.setState({ copied: false });
		}, 1000);
	}

	render() {
		console.log('*** AAAA', this.state);
		const { allListEvents, copied } = this.state;

		return (
			<div className="main-view">
				<div className="borderbottom">
					<div className="pt-3 pb-3 container container-center main-view-container">
						<p className="pt-3">
							{' '}
							На главной пока только список событий. Все остальное в разделе
							&quot;О нас&quot;.{' '}
						</p>
						<p>
							<Button color="warning">
								<Link className="reset-link-style" to="/about">
									О нас
								</Link>
							</Button>
							<button
								type="button"
								className="btn btn-warning btn-clipboard"
								disabled={copied}
								data-clipboard-text={this.getClipboardText()}
								onClick={() => this.animateCopyingAllEvents()}
							>
								{copied && <span>Скопировано</span>}
								{!copied && <span>Скопировать все</span>}
							</button>
						</p>
					</div>
				</div>
				<div className="pt-3">
					{/* <Map allEvents={allMapEvents}/> */}
					{allListEvents.length
						? allListEvents.map(event =>
								this.displayEvent(event.event, event.calendarName),
						  )
						: null}
				</div>
			</div>
		);
	}
}

export default MainView;
