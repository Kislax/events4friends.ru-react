/* eslint-disable */
// TODO: используется в MainView, MainView не используется нигде, если не нужен удалить?
//
import React, { Component } from 'react';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/locale/ru';
import AddToCalendar from 'react-add-to-calendar';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'react-add-to-calendar/dist/react-add-to-calendar.css';
import './EventItem.css';

moment.locale('ru');

class EventItem extends Component {
	constructor(props) {
		super(props);
		const {
			summary: title,
			description,
			location,
			start,
			end,
		} = this.props.googleEvent;

		this.state = {
			moreInfo: false,
			event: {
				title,
				description,
				location,
				startTime: start.dateTime || '2019-01-01T00:00:00',
				endTime: end.dateTime || '2019-01-01T00:00:00',
			},
			copied: false,
		};
	}

	componentDidMount() {
		// думаю здесь это не нужно, компонент уже получает пропс при инициализации
		// фактически здесь сейчас присвоение начального состояния, но пропсы или есть или их нет,
		// поэтому присвоение в state лучше делать в конструкторе.
		/*
		const {
			summary: title,
			description,
			location,
			start,
			end,
		} = this.props.googleEvent;

		this.setState({
			event: {
				title,
				description,
				location,
				startTime: start.dateTime,
				endTime: end.dateTime,
				coordinates: this.parseLonLat(),
			},
    });
    */
		// локаль можно подгружать сразу после импорта
		// moment.locale('ru');
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	parseLonLat = () => {
		const { googleEvent } = this.props;

		const coordinates = {
			latitude: '',
			longitude: '',
		};

		if (googleEvent && googleEvent.location) {
			//
			// Link: https://stackoverflow.com/a/18690202/1775459
			//
			// This will get output:
			// ["54.649617, 19.901687"]
			//
			const lonLat = googleEvent.location.match(
				/[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/g,
			);

			if (lonLat && lonLat[0]) {
				const lonLatArray = lonLat[0].match(
					/[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)/g,
				);
				coordinates.latitude = lonLatArray[0];
				coordinates.longitude = lonLatArray[1];
			}
		}

		return coordinates;
	};

	getStartDate = () => {
		const event = this.props.googleEvent;

		let startDate = 'Не указано';

		if (event.start && event.start.dateTime) {
			startDate = moment(event.start.dateTime).format('D MMMM, dddd');
		}

		return startDate;
	};

	getStartTime = () => {
		const event = this.props.googleEvent;

		let startDate = 'Не указано';

		if (event.start && event.start.dateTime) {
			startDate = moment(event.start.dateTime).format('HH:mm');
		}

		return startDate;
	};

	getEndTime = () => {
		const event = this.props.googleEvent;

		let endDate = 'Не указано';

		if (event.end && event.end.dateTime) {
			endDate = moment(event.end.dateTime).format('HH:mm');
		}

		return endDate;
	};

	getLocation = () => {
		const event = this.props.googleEvent;

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

	formatStartDate() {
		if (this.props.googleEvent.start && this.props.googleEvent.start.dateTime) {
			return (
				<span className="event-date">
					<Moment format="D MMMM, dddd" locale="ru">
						{this.props.googleEvent.start.dateTime}
					</Moment>
				</span>
			);
		}
		return <span className="event-date">Не указано</span>;
	}

	formatStartTime() {
		if (this.props.googleEvent.start && this.props.googleEvent.start.dateTime) {
			return (
				<span className="event-time">
					<Moment format="HH:mm" locale="ru">
						{this.props.googleEvent.start.dateTime}
					</Moment>
				</span>
			);
		}
		return <span className="event-time">Не указано</span>;
	}

	formatEndTime() {
		if (this.props.googleEvent.end && this.props.googleEvent.end.dateTime) {
			return (
				<span className="event-time">
					<Moment format="HH:mm" locale="ru">
						{this.props.googleEvent.end.dateTime}
					</Moment>
				</span>
			);
		}
		return <span className="event-time">Не указано</span>;
	}

	formatSummary() {
		if (this.props.googleEvent.summary) {
			return (
				<span className="event-summary">{this.props.googleEvent.summary}</span>
			);
		}
		return <span className="event-summary">Не указано</span>;
	}

	formatLocation() {
		if (this.props.googleEvent.location) {
			/**
			 * @type {!string}
			 */
			const { location } = this.props.googleEvent;

			/**
			 * @type {!string}
			 */
			let simpleLocation = '';

			/**
			 * @type {!number}
			 */
			const secondCommaPosition = location.indexOf(
				',',
				location.indexOf(',', 0) + 1,
			);

			if (secondCommaPosition > 0) {
				simpleLocation = location.substr(0, secondCommaPosition);
			} else {
				simpleLocation = location;
			}

			const { coordinates } = this.state.event;
			const hasCoordinates = Boolean(
				coordinates && coordinates.latitude && coordinates.longitude,
			);

			let url = '';
			if (hasCoordinates) {
				url = `https://maps.google.com/?q=${coordinates.latitude},${coordinates.longitude}`;
			}

			return hasCoordinates ? (
				<a href={url} className="event-location">
					{simpleLocation}
				</a>
			) : (
				<span className="event-location">{simpleLocation}</span>
			);
		}
		return <span className="event-location">Не указано</span>;
	}

	formatEmail() {
		if (this.props.googleEvent.creator.email) {
			return (
				<div className="event-email">
					<span>Написать организаторам: </span>
					<span>{this.props.googleEvent.creator.email}</span>
					<button
						className="btn btn-link btn-email"
						onClick={() =>
							window.open(`mailto:${this.props.googleEvent.creator.email}`)
						}
					>
						<svg
							id="i-mail"
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							fill="none"
							stroke="currentcolor"
						>
							<path d="M2 26 L30 26 30 6 2 6 Z M2 6 L16 16 30 6" />
						</svg>
					</button>
				</div>
			);
		}
		return null;
	}

	formatName() {
		if (this.props.googleEvent.creator.displayName) {
			return (
				<div className="event-name">
					<p>Автор: {this.props.googleEvent.creator.displayName}</p>
				</div>
			);
		}
		return null;
	}

	formatDescription() {
		if (this.props.googleEvent.description) {
			return (
				<div className="event-description">
					<p
						dangerouslySetInnerHTML={{
							__html: this.props.googleEvent.description,
						}}
					/>
				</div>
			);
		}
		return null;
	}

	shareEvent = () => {
		this.setState({ copied: true });
		this.timer = setTimeout(() => {
			this.setState({ copied: false });
		}, 1000);
	};

	getClipboardText = () => {
		const { googleEvent } = this.props;

		const startDate = this.getStartDate();
		const startTime = this.getStartTime();
		const endTime = this.getEndTime();
		const summary = googleEvent.summary || 'Не указано';
		const location = this.getLocation();
		const details = `📅 ${startDate} 🕗 ${startTime} - ${endTime} － «${summary}» 📍${location}`;

		const url = `http://events4friends.ru/#/event/${this.props.googleEvent.id}/`;

		const clipboardText = `Приглашаю на мероприятие:\n\n${details}\n\nПодробнее на сайте:\n${url}`;

		return clipboardText;
	};

	moreInfo() {
		const icon = { 'calendar-plus-o': 'left' };
		const items = [
			{ google: 'Google' },
			{ apple: 'Apple Calendar' },
			{ outlook: 'Outlook' },
		];

		if (!this.state.moreInfo) {
			return (
				<div className="event-more btn-container">
					<button
						type="button"
						className="btn btn-warning btn-more"
						onClick={() => this.setState({ moreInfo: !this.state.moreInfo })}
					>
						{' '}
						{this.state.moreInfo ? 'Свернуть ↑' : 'Подробнее ↓'}
					</button>
					<button type="button" className="btn btn-warning btn-more">
						<Link
							className="reset-link-style"
							to={`/event/${this.props.googleEvent.id}`}
							onClick={() => this.props.getEvent(this.props.googleEvent.id)}
						>
							К событию
						</Link>
					</button>
					<button type="button" className="btn btn-warning btn-more">
						<AddToCalendar
							event={this.state.event}
							buttonTemplate={icon}
							buttonLabel="Добавить в календарь"
							listItems={items}
						/>
					</button>
					<button
						type="button"
						className="btn btn-warning btn-more btn-clipboard"
						disabled={this.state.copied}
						data-clipboard-text={this.getClipboardText()}
						onClick={this.shareEvent}
					>
						{this.state.copied && <span>Скопировано</span>}
						{!this.state.copied && (
							<span>
								<FontAwesomeIcon icon="share" className="share-icon" />
								Поделиться
							</span>
						)}
					</button>
				</div>
			);
		}
		console.info(this.props.googleEvent);
		return (
			<div className="event-more">
				<div className="event-more btn-container ">
					<button
						type="button"
						className="btn btn-warning btn-more"
						onClick={() => this.setState({ moreInfo: !this.state.moreInfo })}
					>
						{' '}
						{this.state.moreInfo ? 'Свернуть ↑' : 'Подробнее ↓'}
					</button>
					<button type="button" className="btn btn-warning btn-more">
						<Link
							className="reset-link-style"
							to={`/event/${this.props.googleEvent.id}`}
							onClick={() => this.props.getEvent(this.props.googleEvent.id)}
						>
							К событию
						</Link>
					</button>
					<button type="button" className="btn btn-warning btn-more">
						<AddToCalendar
							event={this.state.event}
							buttonTemplate={icon}
							buttonLabel="Добавить в календарь"
							listItems={items}
						/>
					</button>
					<button
						type="button"
						className="btn btn-warning btn-more btn-clipboard"
						disabled={this.state.copied}
						data-clipboard-text={this.getClipboardText()}
						onClick={this.shareEvent}
					>
						{this.state.copied && <span>Скопировано</span>}
						{!this.state.copied && (
							<span>
								<FontAwesomeIcon icon="share" className="share-icon" />
								Поделиться
							</span>
						)}
					</button>
				</div>
				{this.renderInfoBlock()}
			</div>
		);
	}

	renderInfoBlock = () => {
		return (
			<>
				{this.formatDescription()}
				{this.formatName()}
				{this.formatEmail()}
			</>
		);
	};

	render() {
		return (
			<div className="borderbottom">
				<div className="container">
					<div className="event-item container-center main-view-container">
						<small className="calendar-name">#{this.props.name}</small>
						<span role="img" aria-label="Date">
							📅
						</span>
						{this.formatStartDate()}
						<span role="img" aria-label="Time">
							🕗
						</span>
						{this.formatStartTime()}-{this.formatEndTime()}－ «
						{this.formatSummary()}»
						<span role="img" aria-label="Location">
							📍
						</span>
						{this.formatLocation()}
						{this.props.match.path === '/' ||
						this.props.match.path === '/events/'
							? this.moreInfo()
							: this.renderInfoBlock()}
					</div>
				</div>
			</div>
		);
	}
}

EventItem.defaultProps = {
	googleEvent: {
		title: '',
		description: '',
		location: '',
		startTime: '2019-01-01T00:00:00',
		endTime: '2019-01-01T00:00:00',
	},
};

export default withRouter(EventItem);
